import {BroadcastBridge} from "./drivers/BroadcastBridge.ts";
import {WSBridge} from "./drivers/WSBridge.ts";
import {OBBeyond20} from "./drivers/OBBeyond20.ts";

export function bridgeFactory(type: string, args: any) {
    switch(type) {
        case "broadcast":   return new BroadcastBridge();
        case "websocket":   return new WSBridge(args.url);
        case "obbeyond20":  return new OBBeyond20();
    }
}