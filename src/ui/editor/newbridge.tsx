import ReactDOM from 'react-dom/client'
import BridgeBuilderApp from './BridgeBuilderApp.tsx'
//import '../configurator/index.css'
import WaitForOwlbear from "../configurator/WaitForOwlbear.tsx";

import "./index.css"
import BridgeEditorApp from "./BridgeEditorApp.tsx";
import {BridgeConfig, getConfig} from "../../BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";

const params = new URLSearchParams(window.location.search);
const editParam = params.get("edit");

function lookupConfig(bridgeName: string): BridgeConfig {
    const config = getConfig(OBR.room.id).bridges.find((b: BridgeConfig) => b.name == bridgeName);
    if(!config) throw new Error("attempting to edit bridge that doesn't exist " + bridgeName)

    return config;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <WaitForOwlbear>
        { editParam ? <BridgeEditorApp editConfig={lookupConfig(editParam)}/> : <BridgeBuilderApp /> }
    </WaitForOwlbear>
    );
