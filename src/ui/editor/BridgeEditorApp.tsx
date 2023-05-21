import ConfigEditor from "./ConfigEditor.tsx";
import {BridgeConfig} from "../../BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";
import OwlbearTheme from "../OwlbearTheme.tsx";

export default function BridgeEditorApp({editConfig}: {editConfig: BridgeConfig}) {
    function onBack() {
        OBR.modal.close("moe.snail.magic-circle/newbridge");
    }
    
    return (
        <OwlbearTheme>
            <>
                <h1>Edit source</h1>

                <ConfigEditor onBack={onBack} editConfig={editConfig} />
            </>
        </OwlbearTheme>
    );
}