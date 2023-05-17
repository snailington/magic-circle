import "./BridgeListItem.css"
import {BridgeConfig} from "../../BridgeConfig.ts";
import {useEffect, useState} from "react";
import {BridgeStatusClient} from "../../BridgeStatus.ts";
import OBR from "@owlbear-rodeo/sdk";

export default function BridgeListItem({bridge}: {bridge: BridgeConfig }) {
    const [activity, setActivity] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => BridgeStatusClient.onUpdate(bridge.name, (status) => {
        switch(status.type) {
            case "activity":
                setActivity(true);
                setTimeout(() => setActivity(false), 1000);
                break;
            case "error":
                setError(true);
                break;
        }
    }), []);

    function beginDelete() {
        OBR.modal.open({
            id: "moe.snail.magic-circle/deletebridge",
            url: `/deletebridge.html?name=${bridge.name}`,
            height: 225,
            width: 300
        });
    }

    function beginEdit() {
        OBR.modal.open({
            id: "moe.snail.magic-circle/newbridge",
            url: `/newbridge.html?edit=${bridge.name}`,
            height: 400,
            width: 400
        })
    }

    const statusClass = error ? "status-error" : (activity ? "status-active" : "status-inactive");

    return (
        <div className="bridge">
            <div className="bridge-name">{bridge.name}</div>
            <div className="bridge-type">{bridge.type}</div>
            <div className={`bridge-status ${statusClass}`} />
            <button className="btn-bridge-edit" onClick={beginEdit}>edit</button>
            <button className="btn-bridge-delete" onClick={beginDelete}>X</button>
        </div>
    )
}