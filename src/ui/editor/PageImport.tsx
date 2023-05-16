import {useState} from "react";
import {addBridge, BridgeConfig} from "../../BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";
import "./PageImport.css"

export default function PageImport({setPage}: {setPage: (page: string)=>void}) {
    const [configString, setConfigString] = useState("");

    let status;
    let importable = false;
    let config: BridgeConfig | undefined;

    if(configString.length > 0) {
        try {
            config = JSON.parse(configString);
        } catch(e) {
            console.log(e);
        }
    }

    if(config) {
        for(const key in config) {
            if(key[0] == '_') delete config[key];
        }
        if(config.name && config.type && config.perms && config.name.length > 0)
            importable = true;

        status = <div className="config-status">
            <div className="config-label">Name:</div>
            <div className="config-value">{config.name}</div>

            <div className="config-label">Type:</div>
            <div className="config-value">{config.type}</div>

            <div className="config-label">Permissions:</div>
            <div className="config-value">{config.perms}</div>
        </div>;
    }

    function clickImport() {
        if(!config) return;
        addBridge(OBR.room.id, config);
        OBR.modal.close("moe.snail.magic-circle/newbridge");
    }

    return (
        <>
            <h1>Import Source</h1>
            <p>Paste your source configuration below:</p>
            <textarea onChange={(e) => setConfigString(e.target.value)} value={configString}></textarea>
            {status}
            <div className="bottom-btns">
                <button onClick={() => setPage("main")}>Back</button>
                <button disabled={!importable} onClick={clickImport}>Import</button>
            </div>
        </>
    );
}