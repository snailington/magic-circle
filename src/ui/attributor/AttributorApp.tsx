import {Attribution} from "../../Attribution.tsx";
import AttributionLine from "./AttributionLine.tsx";
import {useEffect, useState} from "react";
import OBR, {Player} from "@owlbear-rodeo/sdk";

interface AttributionItem extends Attribution {
    id: number
}

export default function AttributorApp() {
    const [playerList, setPlayerList] = useState(new Array<Player>())
    const [attributions, setAttributions] = useState(() => {
        try {
            const saved = window.localStorage.getItem("magic-circle-attribution");
            if(saved) {
                const parsed = JSON.parse(saved);
                if(!(parsed instanceof Array)) return new Array<AttributionItem>();
                parsed.forEach((a, i) => a.id = i);
                return parsed as AttributionItem[];
            }
        } catch {
            console.log("attribution table error");
        }
        return new Array<AttributionItem>();
    });
    const [nextId, setNextId] = useState(attributions.length);
    
    useEffect(() => {
        OBR.party.getPlayers().then((p) => setPlayerList(p));
        return OBR.party.onChange((p) => setPlayerList(p));
    }, []);
    
    function addLine() {
        attributions.push({ id: nextId, in: "", out: "auto" });
        setNextId(nextId+1);
        setAttributions(Array.from(attributions));
    }
    
    function removeLine(id: number) {
        const idx = attributions.findIndex((a) => a.id == id);
        if(idx == -1) return;
        attributions.splice(idx, 1);
        setAttributions(Array.from(attributions));
    }
    
    function update(attribution: Attribution) {
        const item = attribution as AttributionItem;
        const idx = attributions.findIndex((a) => a.id == item.id);
        if(idx == -1) return;
        attributions[idx] = item;
        setAttributions(Array.from(attributions));
    }
    
    function save() {
        window.localStorage.setItem("magic-circle-attribution",
            JSON.stringify(attributions.map((a) => { return {in: a.in, out: a.out}} )));
    }
    
    return (
        <>
            {attributions.map((a) =>
                    <AttributionLine key={a.id} attribution={a} players={playerList}
                        onUpdate={update} onRemove={() => removeLine(a.id)}/>)}
            <div className="button-bar">
                <button onClick={addLine}>+</button>
                <button onClick={save}>save</button>
            </div>
        </>
    );
}