import BridgeListItem from "./BridgeListItem.tsx";
import "./BridgeList.css"
import {getBridges} from "../../BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";

export default function BridgeList() {
    return (
        <div id="bridge-list">
            { getBridges(OBR.room.id)?.map((b) =>
                <BridgeListItem key={b.name} bridge={b} />) }
        </div>
    )
}