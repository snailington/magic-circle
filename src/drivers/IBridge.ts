import {RPC, MsgRPC} from "magic-circle-api";

export type BridgeCallback = (packet: RPC | MsgRPC[]) => void;

export interface IBridge {
    /*
     * open the bridge's communication channel
     * @param callback - the handler to which any incoming packets are passed
     * @return a promise that resolves when bridge is fully opened
    */
    open(callback: BridgeCallback): Promise<void>;
    
    /*
     * close the communication channel
    */
    close(): void;
    
    /*
     * if applicable, send a reply to the remote client over the bridge
    */
    send(reply: RPC): void;
}