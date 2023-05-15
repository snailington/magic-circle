import "./BridgeListItem.css"
import {BridgeConfig} from "../BridgeConfig.ts";
import {useEffect, useState} from "react";
import {BridgeStatusClient} from "../BridgeStatus.ts";

export default function BridgeListItem({bridge}: {bridge: BridgeConfig }) {
    const [activity, setActivity] = useState(false);

    useEffect(() => BridgeStatusClient.onUpdate(bridge.name, () => {
        setActivity(true);

        setTimeout(() => setActivity(false), 1000);
    }), []);

    const statusClass = activity ? "status-active" : "status-inactive";

    return (
        <div className="bridge">
            <div className="bridge-name">{bridge.name}</div>
            <div className="bridge-type">{bridge.type}</div>
            <div className={`bridge-status ${statusClass}`} />
            <button className="btn-bridge-open">open</button>
            <button className="btn-bridge-edit">edit</button>
            <button className="btn-bridge-delete">X</button>
        </div>
    )
}