import OBR, {Metadata} from "@owlbear-rodeo/sdk";
import MagicCircle, {MsgRPC, RollInfo, RPC} from "magic-circle-api";

interface RumbleMsg {
    chatlog: string,
    sender: string,
    targetId: string,
    created: string
}

/*
 * Special case routing to send dice messages to Rumble! chat
 */
export async function rumbleRouting(_: string, rpc: RPC) {
    if(window.localStorage.getItem("rumbleRouting") != "true") return;
    if(rpc.cmd != "msg") return;

    const msg = rpc as MsgRPC;
    const toRumble: Partial<RumbleMsg> = {
        targetId: msg.whisper || "0000",
        sender: msg.author,
        created: new Date().toISOString()
    };

    const rollInfo = msg.metadata as RollInfo;

    switch(msg.type) {
        case "chat":
        case "info":
            toRumble.chatlog = msg.text;
            break;
        case "dice":
            if(!msg.metadata?.total) return;
            toRumble.chatlog = `rolled ${msg.text} (${MagicCircle.toDiceString(rollInfo)} → ` +
            `[${rollInfo.results?.join('-')}]) for ${rollInfo.total}!`
            break;
    }
    
    const md: Partial<Metadata> = {};
    md["com.battle-system.friends/metadata_chatlog"] = toRumble;
    await OBR.scene.setMetadata(md);
}