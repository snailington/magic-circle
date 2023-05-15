import {BridgeConfig} from "./BridgeConfig.ts";
import {BroadcastBridge} from "./drivers/BroadcastBridge.ts";
import {WSBridge} from "./drivers/WSBridge.ts";
import {OBBeyond20} from "./drivers/OBBeyond20.ts";

export function bridgeFactory(config: BridgeConfig) {
    switch(config.type) {
        case "broadcast":   return new BroadcastBridge();
        case "websocket":   return new WSBridge(config.url);
        case "obbeyond20":  return new OBBeyond20();
    }
}