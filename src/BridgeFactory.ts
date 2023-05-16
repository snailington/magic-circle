import {IBridge} from "./drivers/IBridge.ts";
import {BridgeConfig} from "./BridgeConfig.ts";
import {bridgeDirectory} from "./BridgeDirectory.ts";

// Attempt to instantiate a bridge via a configuration object
export function bridgeFactory(config: BridgeConfig): IBridge {
    for(const bridgeDef of bridgeDirectory) {
        if(bridgeDef.id != config.type) continue;
        return new bridgeDef.type(config);
    }

    throw new Error(`unknown bridge type ${config.type}`);
}