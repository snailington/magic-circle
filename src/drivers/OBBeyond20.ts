import {IBridge} from "./IBridge.ts";
import {MsgRPC} from "magic-circle-api";

// Bridges gludington's beyond20 fork into the Magic Circle bus
export class OBBeyond20 implements IBridge {
    active = false;

    open(callback: (packet: any) => void): Promise<void> {
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
                callback({cmd: "error", msg: "Beyond20 not detected"});
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
        
        if(evt.attack_rolls.length > 0)
            callback(this.parseRolls(evt, evt.attack_rolls));
        
        if(evt.damage_rolls.length > 0)
            callback(this.parseRolls(evt, evt.damage_rolls));
    }
    
    parseRolls(evt: any, rolls: any): MsgRPC {
        const sets = rolls.map((set: any) => set instanceof Array ? set[1] : set);

        let total = 0;
        let dice = new Array<number>();
        let results = new Array<number>();
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
                }
            }

            dice = [...dice, ...new Array<number>(sets[i].parts[0].amount).fill(sets[i].parts[0].faces)];
            results = [...results, ...sets[i].parts[0].rolls.map(({roll}:{roll:number}) => roll)]
        }
        
        return {
            cmd: "msg",
            type: "dice",
            text: `${evt.title} ${sets[0].type} (${sets[0].formula}) [${results.join(', ')}]`,
            author: evt.character,
            metadata: {
                dice: dice,
                results: results,
                total: total,
                kind: sets[0].type
            }
        }
    }
}