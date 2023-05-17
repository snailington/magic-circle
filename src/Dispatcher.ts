import {IBridge} from "./drivers/IBridge.ts";
import MagicCircle, {ConfigRPC, MsgRPC, RPC, SetRPC} from "magic-circle-api";
import OBR from "@owlbear-rodeo/sdk";
import {BridgeConfig, getConfig} from "./BridgeConfig.ts";
import {bridgeFactory} from "./BridgeFactory.ts";
import {OpenRPC} from "magic-circle-api"

class BridgeInfo {
    config: BridgeConfig;
    bridge: IBridge;
    
    // RPCs that request information are valid to be sent over this bridge
    readAccess = false;
    // RPCs that modify the state of the game are valid to be sent over this bridge
    writeAccess = false;
    // RPCs that control the configuration of Magic Circle are valid to be sent over this bridge
    controlAccess = false;
    
    constructor(config: BridgeConfig, bridge: IBridge, mode: string) {
        this.config = config;
        this.bridge = bridge;
        this.setMode(mode);
    }
    
    setMode(mode: string) {
        for(const flag of mode) {
            switch(flag) {
                case "r":
                    this.readAccess = true;
                    break;
                case "w":
                    this.writeAccess = true;
                    break;
                case "c":
                    this.controlAccess = true;
                    break;
            }
        }
    }
}

export class Dispatcher {
    bridges: Map<string, BridgeInfo>;
    onmessage?: ((source: string, packet: RPC) => void);
    onerror?: ((source: string, packet: RPC | null, error: any) => void);

    constructor() {
        this.bridges = new Map<string, BridgeInfo>();
        this.install({
            name: "__bc",
            type: "broadcast",
            perms: "rwcm",
            channel: "magic-circle",
            _system: true
        }, true).then();
    }

    reloadConfig() {
        const config = getConfig(OBR.room.id);

        // the bridges in the config file to be loaded
        const configBridges: BridgeConfig[] = config.bridges;
        // the bridges that are currently running
        const currentBridges = Array.from(this.bridges.values()).map((b) => b.config);

        // find the unions and differences between existing and next state

        const opening = new Array<BridgeConfig>();
        const existing = configBridges.reduce((acc, bridge) => {
            if(!currentBridges.find((b) => b.name == bridge.name)) opening.push(bridge);
            else acc.push(bridge);
            return acc;
        }, new Array<BridgeConfig>());
        const closing = currentBridges.reduce((acc, bridge) => {
            if(!configBridges.find((b) => b.name == bridge.name)) acc.push(bridge);
            return acc;
        }, new Array<BridgeConfig>());

        // uninsall bridges that aren't in the new config
        for(const bridge of closing) {
            if(bridge._system) continue;
            this.uninstall(bridge.name);
        }

        // install bridges that aren't in the old one
        for(const bridge of opening) {
            this.install(bridge).then();
        }

        // check if we need to reinstall ones that are in both
        for(const bridge of existing) {
            const current: BridgeInfo = this.bridges.get(bridge.name) as BridgeInfo;

            let changed = false;
            for(const property in bridge) {
                if(bridge[property] == current.config[property]) continue;
                changed = true;
                break;
            }

            if(!changed) continue;

            this.uninstall(bridge.name);
            this.install(bridge).then();
        }
    }

    /*
     * install a bridge driver
     * @param key - bridge driver key
     * @param noAnnounce - don't send an open announcement
     */
    async install(config: BridgeConfig, noAnnounce = false) {
        console.log(`magic-circle: installing bridge ${config.type}(${config.name})`)
        try {
            const driver = bridgeFactory(config);
            const info = new BridgeInfo(config, driver, config.perms);

            await driver.open((packet) => this.dispatch(info, packet));

            if(!noAnnounce) {
                driver.send(<OpenRPC>{
                    cmd: "open",
                    version: 1,
                    room: OBR.room.id
                });
            }

            this.bridges.set(config.name, info);
        } catch(e: any) {
            // delay reporting install errors because statusclient likely isn't ready to receive it yet
            setTimeout(() => this.handleError(config.name, null, e), 100);
        }
    }

    /*
     * uninstall a bridge driver
     * @param key - bridge key to uninstall
    */
    uninstall(key: string) {
        console.log(`magic-circle: uninstalling bridge (${key})`);
        this.bridges.get(key)?.bridge.close();
        this.bridges.delete(key);
    }
    
    /*
     * validate that an object is a correctly formatted and valid RPC
     * @return a validated RPC or null if it could not be validated 
    */
    validate(info: BridgeInfo, packet: any): RPC | null {
        switch(packet.cmd) {
            case "config":
                if(!info.controlAccess) return null;
                break;
            case "set": case "set-item":
                if(!info.writeAccess) return null;
                break;
            case "get":
                if(!info.readAccess) return null;
                break;
            case undefined:
                return null;
        }
        
        return packet as RPC;
    }

    /*
     * handle an RPC, effecting whatever state changes it requires
     * @param source - key of originating bridge
     * @param packet - the RPC packet to process
    */
    async dispatch(source: BridgeInfo, packet: RPC | MsgRPC[]) {
        try {
            if(packet instanceof Array) {
                if(packet.find((p) => !this.validate(source, p))) return;
                if(this.onmessage) this.onmessage(source.config.name as string, packet[0]);
                await MagicCircle.sendMessage(packet);
                return;
            }

            if(!this.validate(source, packet)) return;
            if(this.onmessage) this.onmessage(source.config.name as string, packet);

            switch(packet.cmd) {
                case "ping":
                    await source.bridge.send({cmd: "pong"});
                    break;
                case "config":
                    this.handleConfig(packet as ConfigRPC);
                    break;
                case "set":
                    await this.dispatchSet(packet as SetRPC);
                    break;
                case "msg":
                    await MagicCircle.sendMessage(packet as (MsgRPC | MsgRPC[]));
                    break;
                case "error":
                    this.handleError(source.config.name as string, packet);
                    break;
            }
        } catch(e) {
            this.handleError(source.config.name as string, packet instanceof Array ? packet[0] : packet, e);
        }
    }

    private handleError(source: string, packet: RPC | null, error?: any) {
        console.error(`magic-circle: error handling source "${source}"`, packet, error);
        if(this.onerror) this.onerror(source, packet, error);
    }

    private handleConfig(packet: ConfigRPC) {
        switch(packet.subcmd) {
            case "reload":
                this.reloadConfig();
                break;
        }
    }

    private async dispatchSet(packet: SetRPC) {
        const md: Partial<any> = {};
        switch(packet.target) {
            case "room":
                md[packet.key] = packet.value;
                await OBR.room.setMetadata(md);
        }
    }
}