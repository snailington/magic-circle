import "./ControlPanel.css"
import StatusLine from "./StatusLine.tsx";
import OBR from "@owlbear-rodeo/sdk";

export default function ControlPanel() {
    function newSource() {
        OBR.modal.open({
            id: "moe.snail.magic-circle/newbridge",
            url: "/newbridge.html",
            height: 400,
            width: 400
        })
    }

    return (
        <div id="control-panel">
            <button className="btn-new-source" onClick={newSource}>New Souce</button>
            <StatusLine/>
        </div>
    )
}