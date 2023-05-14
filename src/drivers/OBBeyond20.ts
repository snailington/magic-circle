import {IBridge} from "./IBridge.ts";
import {MsgRPC} from "magic-circle-api";

// Bridges gludington's beyond20 fork into the Magic Circle bus
export class OBBeyond20 implements IBridge {
    open(callback: (packet: any) => void): Promise<void> {
        console.log("obb20");
        window.addEventListener("message", (e) => {
            console.log("event received", e);
            
            if(!e.origin.match(/owlbear.(app|rodeo)$/)) return;
            if(!e.data?.DdbEvent) return;
            
            this.parseEvent(e.data.DdbEvent, callback);
        });
        
        const regMsg = { action: "DdbRegister", id: "moe.snail.magic-circle" };
        window.parent.postMessage(regMsg, "*");
        
        return Promise.resolve();
    }
    
    close = () => void 0;
    send = () => void 0;
    
    parseEvent(evt: any, callback: (packet: any) => void){
        if(evt.action != "rendered_roll") return;
        
        if(evt.attack_rolls.length > 0)
            callback(this.parseRolls(evt, evt.attack_rolls[0]));
        
        if(evt.damage_rolls.length > 0)
            callback(this.parseRolls(evt, evt.damage_rolls[1]));
    }
    
    parseRolls(evt: any, set: any): MsgRPC {
        const results = set.rolls.map(({roll} : {roll: number}) => roll.toString());
        
        return {
            cmd: "msg",
            type: "dice",
            text: `${evt.title} ${set.type} (${set.formula}) [${results.join(', ')}]`,
            time: Date.now(),
            author: evt.character,
            metadata: {
                dice: new Array(set.amount).fill(set.faces.toString()),
                results: results,
                total: set.total,
                kind: set.type
            }
        }
    }
}