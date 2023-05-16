import OBR from "@owlbear-rodeo/sdk";
import {deleteBridge} from "../../BridgeConfig.ts";

export default function BridgeDeleterApp() {
    
    const params = new URLSearchParams(window.location.search);
    const bridgeName = params.get("name") || "";
    
    function deleteNo() {
        OBR.modal.close("moe.snail.magic-circle/deletebridge");
    }

    function deleteYes() {
        deleteBridge(OBR.room.id, bridgeName);
        OBR.modal.close("moe.snail.magic-circle/deletebridge")
    }

    return (
        <div>
            <h1>Delete Source</h1>
            Are you sure you want to delete {bridgeName}?
            <div className="btn-yes-no">
                <button onClick={deleteNo}>no</button>
                <button onClick={deleteYes}>yes</button>
            </div>
        </div>
    )
}