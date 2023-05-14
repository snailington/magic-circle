import {IBridge} from "./IBridge.ts";
import {RPC} from "magic-circle-api";

export class WSBridge implements IBridge {
    url: string;
    socket: WebSocket | null = null;
    
    constructor(url: string) {
        this.url = url;
    }
    
    open(callback: (packet: any) => void): Promise<void> {
        this.socket = new WebSocket(this.url);
        this.socket.onmessage = (e) => {
            callback(JSON.parse(e.data));
        }
        
        return new Promise<void>((resolve, reject) => {
            if(!this.socket) {
                reject();
                return;
            }

            this.socket.onopen = () => resolve();
            this.socket.onerror = (e) => reject(e);
        }) ;
    }
    
    close(): void {
        this.socket?.close();
    }
    
    send(reply: RPC): void {
        this.socket?.send(JSON.stringify(reply));
    }
}