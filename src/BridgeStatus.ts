import {Dispatcher} from "./Dispatcher.ts";
import {ConfigRPC, RPC} from "magic-circle-api";
import {BridgeConfig, getConfig} from "./BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";

const STATUS_CHANNEL = "magic-circle-status";

interface BridgeStatusRPC {
    connection: string,
    
    type: "reload" | "activity" | "error";

    bridge?: string;
    time: number;
    cmd?: string;
}

// Sends status on bridge updates to the configurator
export class BridgeStatusServer {
    channel: BroadcastChannel;
    dispatcher?: Dispatcher;
    connectionId?: string;
    
    constructor() {
        this.channel = new BroadcastChannel(STATUS_CHANNEL);
    }

    start(dispatcher: Dispatcher) {
        OBR.player.getConnectionId().then((id) => this.connectionId = id);

        this.dispatcher = dispatcher;
        dispatcher.onmessage = this.dispatchTap.bind(this);
        dispatcher.onerror = this.sendError.bind(this);
    }

    private dispatchTap(sender: string, rpc: RPC) {
        if(rpc.cmd == "config" && (rpc as ConfigRPC).subcmd == "reload") {
            this.channel.postMessage(JSON.stringify({
                connection: this.connectionId,
                type: "reload"
            }));
            return;
        }

        this.channel.postMessage(JSON.stringify({
            connection: this.connectionId,
            type: "activity",
            bridge: sender,
            cmd: rpc.cmd
        }));
    }

    private sendError(sender: string, rpc: RPC | null) {
        this.channel.postMessage(JSON.stringify({
            connection: this.connectionId,
            type: "error",
            bridge: sender,
            cmd: rpc?.cmd
        }));
    }
}

class BridgeStatus {
    lastActivity?: BridgeStatusRPC;
    callback?: (status: BridgeStatusRPC) => void;
}

// Receives status information about bridges from the dispatcher
export class BridgeStatusClient {
    static instance: BridgeStatusClient;
    
    channel: BroadcastChannel;
    status: Map<string, BridgeStatus> = new Map<string, BridgeStatus>();
    connectionId?: string;
    
    reloadCallback?: () => void;
    allActivityCallback?: (bridge: string, cmd: string) => void;

    constructor() {
        BridgeStatusClient.instance = this;

        this.channel = new BroadcastChannel(STATUS_CHANNEL);
    }

    start() {
        this.channel.onmessage = this.messageHandler.bind(this);

        getConfig(OBR.room.id)?.bridges.map((b: BridgeConfig) => this.status.set(b.name, new BridgeStatus()));
        OBR.player.getConnectionId().then((id) => this.connectionId = id);
    }

    private messageHandler(evt: MessageEvent<string>) {
        const rpc: BridgeStatusRPC = JSON.parse(evt.data);
        if(rpc.connection != this.connectionId) return;

        if(rpc.type == "reload") {
            if(this.reloadCallback) this.reloadCallback();
            return;
        }

        if(!rpc.bridge) return;
        const bridge = this.status.get(rpc.bridge);
        if(!bridge) return;

        bridge.lastActivity = rpc;
        if(bridge.callback) bridge.callback(rpc);
        if(this.allActivityCallback) this.allActivityCallback(rpc.bridge, rpc.cmd || "");
    }
    
    // Register a callback that will get called when a bridge's status is updated
    static onUpdate(name: string, callback: (status: BridgeStatusRPC) => void) {
        let bridge = BridgeStatusClient.instance.status.get(name);
        if(!bridge) {
            bridge = new BridgeStatus();
            BridgeStatusClient.instance.status.set(name, bridge);
        }
        bridge.callback = callback;
        
        return () => {if(bridge) bridge.callback = undefined};
    }

    // Register a callback that will be called when config is reloaded
    static onReload(callback: () => void) {
        BridgeStatusClient.instance.reloadCallback = callback;
        return () => BridgeStatusClient.instance.reloadCallback = undefined;
    }

    // Register a callback called on any activity, on any bridge
    static onGlobal(callback: (bridge: string, cmd: string) => void) {
        BridgeStatusClient.instance.allActivityCallback = callback;
        return () => BridgeStatusClient.instance.allActivityCallback = undefined;
    }
}