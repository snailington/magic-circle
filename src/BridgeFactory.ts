import {IBridge} from "./drivers/IBridge.ts";
import {BridgeConfig} from "./BridgeConfig.ts";
import {BroadcastBridge} from "./drivers/BroadcastBridge.ts";
import {WSBridge} from "./drivers/WSBridge.ts";
import {OBBeyond20} from "./drivers/OBBeyond20.ts";

export function bridgeFactory(config: BridgeConfig): IBridge {
    switch(config.type) {
        case "broadcast":   return new BroadcastBridge(config.channel?.toString() || "");
        case "websocket":   return new WSBridge(config.url?.toString() || "");
        case "obbeyond20":  return new OBBeyond20();
    }

    throw new Error(`unknown bridge type ${config.type}`);
}