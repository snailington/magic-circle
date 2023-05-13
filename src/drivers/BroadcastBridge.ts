import {IBridge} from "./IBridge.ts";
import {RPC} from "magic-circle-api";
import OBR from "@owlbear-rodeo/sdk";

// Communication over a browser BroadcastChannel
export class BroadcastBridge implements IBridge {
    private channel: BroadcastChannel;
    
    constructor() {
        this.channel = new BroadcastChannel("magic-circle");
    }
    
    open(callback: (packet: any)=>void): Promise<void> {
        this.channel.onmessage = (evt: MessageEvent<any>) => {
            const packet = JSON.parse(evt.data);
            console.log("bc receive", packet);
            if(packet.cmd == "open" || packet.cmd == "reply" ||
                (packet.room && packet.room != OBR.room.id)) return;
            
            callback(packet);
        };
        
        return new Promise((resolve) => resolve());
    }
    
    close() {
        this.channel.close();
    }
    
    send(reply: RPC) {
        this.channel.postMessage(reply);
    }
}