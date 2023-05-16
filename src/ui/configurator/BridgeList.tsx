import BridgeListItem from "./BridgeListItem.tsx";
import "./BridgeList.css"
import {BridgeConfig, getConfig} from "../../BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";
import {useEffect, useState} from "react";
import {BridgeStatusClient} from "../../BridgeStatus.ts";

export default function BridgeList() {
    const [, forceUpdate] = useState(0);

    useEffect(() => BridgeStatusClient.onReload(() => {
        forceUpdate(Date.now());
    }), []);

    return (
        <div id="bridge-list">
            { getConfig(OBR.room.id)?.bridges.map((b: BridgeConfig) =>
                <BridgeListItem key={b.name} bridge={b} />) }
        </div>
    )
}