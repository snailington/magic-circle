import OBR, {Metadata} from "@owlbear-rodeo/sdk";
import MagicCircle, {MsgRPC, RollInfo} from "magic-circle-api";

/*
 * Special case routing to send dice messages to Rumble! chat
 */
export async function rumbleRouting(msg: MsgRPC) {
    if(msg.type != "dice") return;
    const rollInfo = msg.metadata as RollInfo;
    if(rollInfo.total == undefined) return;
    
    const md: Partial<Metadata> = {};
    md["com.battle-system.friends/metadata_chatlog"] = {
        chatlog: `rolled ${msg.text} (${MagicCircle.toDiceString(rollInfo)} → [${rollInfo.results?.join(',')}]) for ${rollInfo.total}`,
        sender: `${msg.author}`,
        targetId: msg.whisper || "0000",
        created: new Date().toISOString()
    }
    await OBR.scene.setMetadata(md);
}