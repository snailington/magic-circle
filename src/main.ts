import './style.css'
import OBR from "@owlbear-rodeo/sdk";
import {Dispatcher} from "./Dispatcher.ts";
import {BroadcastBridge} from "./drivers/BroadcastBridge.ts";
import {IBridge} from "./drivers/IBridge.ts";
import {WSBridge} from "./drivers/WSBridge.ts";
import {OBBeyond20} from "./drivers/OBBeyond20.ts";

const dispatcher = new Dispatcher();

OBR.onReady(async () => {
  // check if we're allowed to run the dispatcher
  const role = await OBR.player.getRole();
  const metadata = await OBR.room.getMetadata();
  if(role != "GM" && !metadata["moe.snail.magic-circle/allowPlayerRPC"])
    return;
  
  // check if this room is in the detected rooms list, add it if not
  const roomList = JSON.parse(window.localStorage.getItem("magic-circle-rooms") || "{}");
  console.log("roomList", roomList);
  if(roomList[OBR.room.id] == undefined) {
    roomList[OBR.room.id] = { id: OBR.room.id };
    window.localStorage.setItem("magic-circle-rooms", JSON.stringify(roomList));
  }
  
  // instantiate and install all the bridges for this room
  const configKey = `magic-circle-config.${OBR.room.id}`;
  const config = JSON.parse(window.localStorage.getItem(configKey) || "{}");
  
  const bridges = config.bridges || [];
  bridges.push({name: "bc", type: "broadcast", perms: "rwc"});
  
  // TODO: for the time being let's hardcode the knock bridge until the configurator is done
  bridges.push({name: "knock", type: "websocket", perms: "rwc", url: "ws://localhost:12210"});
  bridges.push({name: "obb20", type: "obbeyond20", perms: "w"});

  try {
    for(const bridge of bridges) {
      let driver: IBridge;

      switch(bridge.type) {
        case "broadcast":
          driver = new BroadcastBridge();
          break;
        case "websocket":
          driver = new WSBridge(bridge.url);
          break;
        case "obbeyond20":
          driver = new OBBeyond20();
          break;
        default:
          console.log(`magic-circle: unknown bridge type ${bridge.type} (${bridge.name})`);
          continue;
      }

      await dispatcher.install(bridge.name, driver, bridge.perms);
    }
  } catch(e) {
    console.log(e);
  }
})