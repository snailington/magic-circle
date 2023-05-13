import IRoomInfo from "./IRoomInfo.ts";
import {useState} from "react";

export default function Room({room}: {room: IRoomInfo}) {
    const [config, setConfig] = useState(() =>
        JSON.parse(window.localStorage.getItem(`magic-circle-config.{room.id}`) || "{}")
    )
    
    function onNameChange(evt: InputEvent) {
        config.name = evt.target?.value;
        setConfig(config);
    }
    
    function addBridge() {
        if(config.bridges == undefined) config.bridges = [];
        config.bridges.push({
            type: "websocket",
            
        });
    }
    
    function save() {
        window.localStorage.setItem(`magic-circle-config.{room.id}`,
                                    JSON.stringify(config));
    }
    
    return (
        <div className="room-config">
            <div>{room.id}</div>
            <input type="text" onChange={onNameChange}>{config.name}</input>
            <button onClick={addBridge}>Add Bridge</button>
            <button onClick={save}>Save Config</button>
        </div>
    );
}