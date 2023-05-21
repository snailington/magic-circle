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

    function copyId() {
        OBR.player.getSelection().then((selection) => {
            if(!selection) {
                OBR.notification.show("Please select an item before clicking copy button", "INFO");
                return;
            }
            navigator.clipboard.writeText(selection.join(','));
            OBR.notification.show("Item ID(s) copied to clipboard");
        });
    }

    function showOptions() {
        OBR.modal.open({
            id: "moe.snail.magic-cricle/options",
            url: "/options.html",
            height: 150,
            width: 600
        });
    }

    return (
        <div id="control-panel">
            <button className="btn-new-source" onClick={newSource}>New Souce</button>
            <button className="btn-options" onClick={showOptions}>⚙</button>
            <StatusLine/>
            <button className="btn-copy-id" onClick={copyId}>⎘</button>
        </div>
    )
}