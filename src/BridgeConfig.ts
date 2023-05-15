export interface BridgeConfig {
    name: string,
    type: string,
    perms: string
    
    [other: string]: string
}

export function getBridges(roomId: string): Array<BridgeConfig> | undefined {
    const data = window.localStorage.getItem(`magic-circle-config.${roomId}`);
    if(!data) return;
    return JSON.parse(data).bridges;
}