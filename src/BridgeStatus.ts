import {Dispatcher} from "./Dispatcher.ts";
import {RPC} from "magic-circle-api";
import {getBridges} from "./BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";

const STATUS_CHANNEL = "magic-circle-status";

interface BridgeStatusRPC {
    connection: string,
    
    type: "activity" | "error";
    bridge: string;
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
        this.dispatcher = dispatcher;
        dispatcher.onmessage = this.dispatchTap.bind(this);
        OBR.player.getConnectionId().then((id) => this.connectionId = id);
    }

    private dispatchTap(sender: string, rpc: RPC) {
        this.channel.postMessage(JSON.stringify({
            connection: this.connectionId,
            type: "activity",
            bridge: sender,
            cmd: rpc.cmd
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
    
    constructor() {
        BridgeStatusClient.instance = this;

        this.channel = new BroadcastChannel(STATUS_CHANNEL);
        this.channel.onmessage = this.messageHandler.bind(this);

        getBridges(OBR.room.id)?.map((b) => this.status.set(b.name, new BridgeStatus()));
    }

    start() {
        OBR.player.getConnectionId().then((id) => this.connectionId = id);
    }

    private messageHandler(evt: MessageEvent<string>) {
        const rpc: BridgeStatusRPC = JSON.parse(evt.data);
        console.log("status", rpc);
        
        if(rpc.connection != this.connectionId) return;
        const bridge = this.status.get(rpc.bridge);
        if(!bridge) return;
        
        bridge.lastActivity = rpc;
        if(bridge.callback) bridge.callback(rpc);
    }
    
    // Register a callback that will get called when a bridge's status is updated
    static onUpdate(name: string, callback: (status: BridgeStatusRPC) => void) {
        const bridge = BridgeStatusClient.instance.status.get(name);
        if(!bridge) throw new Error(`unregistered bridge {name}`);
        bridge.callback = callback;
        
        return () => bridge.callback = undefined;
    }
}