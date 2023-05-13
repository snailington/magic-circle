import {ErrorRPC, OpenRPC, ReplyRPC} from "../RPC.ts";


export interface IBridge {
    /*
     * open the bridge's communication channel
     * @param callback - the handler to which any incoming packets are passed
     * @return a promise that resolves when bridge is fully opened
    */
    open(callback: (packet: any)=>void): Promise<void>;
    
    /*
     * close the communication channel
    */
    close(): void;
    
    /*
     * if applicable, send a reply to the remote client over the bridge
    */
    send(reply: OpenRPC | ReplyRPC | ErrorRPC): void;
}