import './style.css'
import OBR from "@owlbear-rodeo/sdk";
import {Dispatcher} from "./Dispatcher.ts";
import {BridgeStatusServer} from "./BridgeStatus.ts";

OBR.onReady(async () => {
  await contention();

  const dispatcher = new Dispatcher();
  const statusServer = new BridgeStatusServer();

  statusServer.start(dispatcher);
  dispatcher.reloadConfig();
})

// returns if and when no other instances of magic circle are running in other tabs
async function contention() {
  const bc = new BroadcastChannel("magic-circle");
  const ping = JSON.stringify({cmd: "ping", room: OBR.room.id});

  let busy = false;
  let timer = 5;

  bc.onmessage = (e) => {
    const rpc = JSON.parse(e.data);
    if(rpc.cmd == "pong" && rpc.room == OBR.room.id) busy = true;
  }

  do {
    busy = false;

    bc.postMessage(ping)
    await new Promise(resolve => setTimeout(resolve, timer));

    if(busy && timer == 5) console.log("magic-circle: another instance detected, holding");
    timer = Math.min(timer * 2, 10000);
  } while(busy);

  bc.close();
}