import {IBridge} from "./IBridge.ts";
import {RPC} from "magic-circle-api";

export class WSBridge implements IBridge {
    socket: WebSocket;
    
    constructor(url: string) {
        this.socket = new WebSocket(url);
    }
    
    open(callback: (packet: any) => void): Promise<void> {
        this.socket.onmessage = (e) => {
            callback(JSON.parse(e.data));
        }
        
        return new Promise<void>((resolve, reject) => {
            this.socket.onopen = () => resolve();
            this.socket.onerror = (e) => reject(e);
        }) ;
    }
    
    close(): void {
        this.socket.close();
    }
    
    send(reply: RPC): void {
        this.socket.send(JSON.stringify(reply));
    }
}