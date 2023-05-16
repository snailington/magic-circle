import {bridgeDirectory} from "../../BridgeDirectory.ts";
import {ChangeEvent, ReactElement, useState} from "react";
import "./PageManual.css"
import BridgeArgumentList from "./BridgeArgumentList.tsx";
import {addBridge, BridgeConfig, getConfig} from "../../BridgeConfig.ts";
import OBR from "@owlbear-rodeo/sdk";

export default function PageManual({setPage}: {setPage: (page: string)=>void}) {
    const [bridge, setBridge] = useState({name: "source", type: "websocket", perms: "rwm"} as BridgeConfig);
    const [selected, setSelected] = useState(bridge.type);

    const bridgeDef = bridgeDirectory.find((def) => def.id == selected);

    const typeOptions = bridgeDirectory.reduce((acc, def) => {
        if(!def.hidden) acc.push(<option key={def.id} value={def.id}>{def.name}</option>);
        return acc;
    }, new Array<ReactElement>());

    function updateName(evt: ChangeEvent<HTMLInputElement>) {
        setBridge({...bridge, name: evt.target.value});
    }

    function updateArg(key: string, value: string) {
        const newConfig = {...bridge};
        newConfig[key] = value;
        setBridge(newConfig);
    }

    function clickImport() {
        const config = getConfig(OBR.room.id);

        const suffix = /(\d.*)$/;
        while(config.bridges.find((b: BridgeConfig) => b.name == bridge.name)) {
            if(bridge.name.match(suffix)) {
                bridge.name = bridge.name.replace(suffix, (s) => (parseInt(s)+1).toString());
            } else {
                bridge.name += "1";
            }
        }

        addBridge(OBR.room.id, bridge);
        OBR.modal.close("moe.snail.magic-circle/newbridge");
    }

    return (
        <>
            <h1>Manual Setup</h1>

            <div id="properties">
                <div className="property">
                    <label htmlFor="input-name">Source Name:</label>
                    <input id="input-name" type="text" value={bridge.name} onChange={updateName}></input>
                </div>

                <div className="property">
                    <label htmlFor="select-type">Source Type:</label>
                    <select id="select-type" value={selected} onChange={(e) => setSelected(e.target.value)}>
                        {typeOptions}
                    </select>
                </div>

                <p className="property-description">{bridgeDef?.description}</p>

                <BridgeArgumentList bridgeDef={bridgeDef} config={bridge} updateArg={updateArg}/>

                <div className="property">
                    <label htmlFor="select-permission">Permissions:</label>
                    <select id="select-permission">
                        <option value="m">Messages Only</option>
                        <option value="wm">Write and Message</option>
                        <option value="rm">Read and Message</option>
                        <option value="rwm">Read, Write, and Message</option>
                        <option value="rwmc">Full Control</option>
                    </select>
                </div>
            </div>

            <div className="bottom-btns">
                <button onClick={() => setPage("main")}>Back</button>
                <button onClick={clickImport}>Import</button>
            </div>
        </>
        );
}