export interface BridgeConfig {
    name: string;
    type: string;
    perms: string;

    _system?: boolean;
    
    [other: string]: string | boolean | undefined
}

const defaultConfig = {
    bridges: [
        { name: "ddb1", type: "websocket", perms: "wrm", url: "ws://localhost:12210" },
    ]
};

export function getConfig(roomId: string) {
    try {
        const data = window.localStorage.getItem(`magic-circle-config.${roomId}`);
        if(data) return JSON.parse(data);
    } catch {
        console.log("magic-circle: configuration error");
    }
    return defaultConfig;
}

function updateConfig(roomId: string, config: any) {
    window.localStorage.setItem(`magic-circle-config.${roomId}`, JSON.stringify(config));
    const channel = new BroadcastChannel("magic-circle");
    channel.postMessage(JSON.stringify({
        cmd: "config",
        subcmd: "reload"
    }));
    channel.close();
}

export function addBridge(roomId: string, bridge: BridgeConfig) {
    const config = getConfig(roomId);
    config.bridges.push(bridge);
    updateConfig(roomId, config);
}

export function deleteBridge(roomId: string, bridgeName: string) {
    const config = getConfig(roomId);
    const idx = config.bridges.findIndex((b:any) => b.name == bridgeName)
    if(idx == -1) return;
    config.bridges.splice(idx, 1);
    updateConfig(roomId, config);
}