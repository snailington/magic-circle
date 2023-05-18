import {IBridge, BridgeCallback} from "./IBridge.ts";
import {MsgRPC, ErrorRPC} from "magic-circle-api";

// Bridges gludington's beyond20 fork into the Magic Circle bus
export class OBBeyond20 implements IBridge {
    active = false;

    open(callback: BridgeCallback): Promise<void> {
        window.addEventListener("message", (e) => {
            if(!e.origin.match(/owlbear.(app|rodeo)$/)) return;
            if(e.data?.DdbRegistration) this.active = true;
            if(!e.data?.DdbEvent) return;
            
            this.parseEvent(e.data.DdbEvent, callback);
        });
        
        let tries = 3;
        const tryRegister = () => {
            if(this.active) return;
            if(tries-- < 0) {
                callback(<ErrorRPC>{cmd: "error", msg: "Beyond20 not detected"});
                return;
            }
            const regMsg = { action: "DdbRegister", id: "moe.snail.magic-circle" };
            window.parent.postMessage(regMsg, "*");
            setTimeout(tryRegister, 2500);
        }
        tryRegister();

        return Promise.resolve();
    }
    
    close = () => void 0;
    send = () => void 0;
    
    parseEvent(evt: any, callback: (packet: any) => void){
        if(evt.action != "rendered-roll") return;

        const batch: Array<MsgRPC> = [];
        if(evt.attack_rolls.length > 0)
            batch.push(this.parseRolls(evt, evt.attack_rolls));
        if(evt.damage_rolls.length > 0)
            batch.push(this.parseRolls(evt, evt.damage_rolls));
        callback(batch);
    }
    
    parseRolls(evt: any, rolls: any): MsgRPC {
        // the roll data appears to be in a different location in attack vs damage rolls, detect it
        const sets = rolls.map((set: any) => set instanceof Array ? set[1] : set);

        let total = 0;
        let dice = new Array<number>();
        let results = new Array<number>();

        // collate the results of all the dice sets in this roll
        for(let i = 0; i < sets.length; i++) {
            if(i == 0) total = sets[i].total;
            else {
                switch(evt.request.advantage) {
                    case 0: // no advantage
                        total += sets[i].total;
                        break;
                    case 3: // advantage
                        total = Math.max(total, sets[i].total);
                        break;
                    case 4: // disadvantage
                        total = Math.min(total, sets[i].total);
                        break;
                    // todo: what are other values of request.advantage?
                }
            }

            dice = [...dice, ...new Array<number>(sets[i].parts[0].amount).fill(sets[i].parts[0].faces)];
            results = [...results, ...sets[i].parts[0].rolls.map(({roll}:{roll:number}) => roll)]
        }
        
        const title = evt.title.match(/^[^(]*/)
        const type = this.interpretRollType(sets[0].type);

        let text = title[0];
        switch(type) {
            case "initiative":
                break;
            default:
                text += "  " + type;
        }

        let suffix = "";
        switch(evt.request.advantage) {
            case 3: // advantage
                suffix += "kh";
                break;
            case 4: // disadvantage
                suffix += "kl";
                break;
        }

        suffix += sets[0].parts.length > 1 ? sets[0].parts[1] + sets[0].parts[2]: "";

        return {
            cmd: "msg",
            type: "dice",
            text: text,
            author: evt.character,
            metadata: {
                dice: dice,
                results: results,
                total: total,
                suffix: suffix,
                kind: type
            }
        };
    }

    // convert beyond20 roll types to the standard magic circle categories
    interpretRollType(type: string): string {
        switch(type) {
            case "to-hit":
                return "attack";
            case "ability-check": case "skill-check":
                return "check";
            case "saving-throw":
                return "save";
            default:
                return type;
        }
    }
}