import {WSBridge} from "./drivers/WSBridge.ts";
import {OBBeyond20} from "./drivers/OBBeyond20.ts";
import {BroadcastBridge} from "./drivers/BroadcastBridge.ts";
import {BridgeConfig} from "./BridgeConfig.ts";
import {IBridge} from "./drivers/IBridge.ts";

export const bridgeDirectory: Array<BridgeDefinition> = [
    {
        id: "broadcast",
        name: "Broadcast",
        description: "JSON RPC over a Broadcast Channel",
        type: BroadcastBridge,
        
        hidden: true,
        
        args: [
            { id: "channel", name: "Channel", description: "Channel name to listen on." }
        ]
    },{
        id: "websocket",
        name: "Websocket",
        description: "JSON RPC over a websocket connection",
        type: WSBridge,
        
        args: [
            { id: "url", name: "URL", description: "Websocket URL of remote endpoint." }
        ]
    },{
        id: "obbeyond20",
        name: "Owlbear-Beyond20",
        description: "Integration with the Owlbear-supporting fork of Beyond20. (https://github.com/gludington/Beyond20)",
        type: OBBeyond20,
    
        args: []
    }
];


export interface BridgeDefinition {
    id: string;
    name: string;
    description: string;
    type: {new(config: BridgeConfig): IBridge};
    hidden?: boolean;
    args: {
        id: string,
        name: string,
        description: string
    }[];
}