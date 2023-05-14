import {IBridge} from "./drivers/IBridge.ts";
import MagicCircle, {MsgRPC, RPC, SetRPC} from "magic-circle-api";
import OBR from "@owlbear-rodeo/sdk";

class BridgeInfo {
    bridge: IBridge;
    
    // RPCs that request information are valid to be sent over this bridge
    readAccess = false;
    // RPCs that modify the state of the game are valid to be sent over this bridge
    writeAccess = false;
    // RPCs that control the configuration of Magic Circle are valid to be sent over this bridge
    controlAccess = false;
    
    constructor(bridge: IBridge, mode: string) {
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
    onmessage: ((source: string, packet: RPC) => void) | undefined = undefined;

    constructor() {
        this.bridges = new Map<string, BridgeInfo>();
    }

    /*
     * install a bridge driver
     * @param key - bridge driver key
     * @param driver - bridge driver instance
     */
    async install(key: string, driver: IBridge, mode = "") {
        const info = new BridgeInfo(driver, mode);
        
        await driver.open((packet: any) => {
            const validated = this.validate(info, packet);
            if(!validated) return;
            this.dispatch(key, validated);
        });
        
        driver.send({
            cmd: "open",
            version: 1,
            room: OBR.room.id
        });
        
        this.bridges.set(key, info);
    }

    /*
     * uninstall a bridge driver
     * @param key - bridge key to uninstall
    */
    uninstall(key: string) {
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
    async dispatch(source: string, packet: RPC) {
        if(this.onmessage) this.onmessage(source, packet);
        
        switch(packet.cmd) {
            case "set":
                await this.dispatch_set(packet as SetRPC);
                break;
            case "msg":
                await MagicCircle.sendMessage(packet as MsgRPC);
                break;
        }
    }
    
    private async dispatch_set(packet: SetRPC) {
        const md: Partial<any> = {};
        switch(packet.target) {
            case "room":
                md[packet.key] = packet.value;
                await OBR.room.setMetadata(md);
        }
    }
}