import {useEffect, useState} from "react";
import "./StatusLine.css"
import {BridgeStatusClient} from "../../BridgeStatus.ts";

export default function StatusLine() {
    const [log, setLog] = useState("");

    useEffect(() => BridgeStatusClient.onGlobal((bridge: string, cmd: string) => {
        const now = new Date();
        const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
            .map((t) => t.toString().padStart(2, '0'))
            .join(':');
        setLog(`${time}: ${bridge} → ${cmd}`);
    }), []);

    return (
        <div id="status-line">
            {log}
        </div>
    );
}