import ConfigEditor from "./ConfigEditor.tsx";
import {BridgeConfig} from "../../BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";

export default function BridgeEditorApp({editConfig}: {editConfig: BridgeConfig}) {
    function onBack() {
        OBR.modal.close("moe.snail.magic-circle/newbridge");
    }
    
    return (
        <>
            <h1>Edit source</h1>
        
            <ConfigEditor onBack={onBack} editConfig={editConfig} />
        </>
    );
}