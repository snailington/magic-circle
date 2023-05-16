import {IBridge} from "./IBridge.ts";
import {RPC} from "magic-circle-api";
import OBR from "@owlbear-rodeo/sdk";
import {BridgeConfig} from "../BridgeConfig.ts";

// Communication over a browser BroadcastChannel
export class BroadcastBridge implements IBridge {
    private channel: BroadcastChannel;
    
    constructor(config: BridgeConfig) {
        console.log(config);
        if(typeof config.channel !== "string") throw new Error("Invalid channel argument");
        this.channel = new BroadcastChannel(config.channel);
    }
    
    open(callback: (packet: any)=>void): Promise<void> {
        this.channel.onmessage = (evt: MessageEvent<any>) => {
            console.log("bc", evt.data);
            const packet = JSON.parse(evt.data);
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
        this.channel.postMessage(JSON.stringify(reply));
    }
}