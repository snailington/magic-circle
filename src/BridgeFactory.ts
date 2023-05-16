import {IBridge} from "./drivers/IBridge.ts";
import {BridgeConfig} from "./BridgeConfig.ts";
import {bridgeDirectory} from "./BridgeDirectory.ts";

export function bridgeFactory(config: BridgeConfig): IBridge {
    for(const bridgeDef of bridgeDirectory) {
        if(bridgeDef.id != config.type) continue;
        return new bridgeDef.type(config);
    }

    throw new Error(`unknown bridge type ${config.type}`);
}