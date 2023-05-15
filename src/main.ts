import './style.css'
import OBR from "@owlbear-rodeo/sdk";
import {Dispatcher} from "./Dispatcher.ts";
import {BridgeStatusServer} from "./BridgeStatus.ts";

const dispatcher = new Dispatcher();
const statusServer = new BridgeStatusServer();

OBR.onReady(async () => {
  statusServer.start(dispatcher);
  dispatcher.reloadConfig();
})