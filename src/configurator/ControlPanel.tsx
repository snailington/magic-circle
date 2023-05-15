import "./ControlPanel.css"
import StatusLine from "./StatusLine.tsx";

export default function ControlPanel() {
    return (
        <div id="control-panel">
            <button className="btn-new-source">New Souce</button>
            <StatusLine/>
        </div>
    )
}