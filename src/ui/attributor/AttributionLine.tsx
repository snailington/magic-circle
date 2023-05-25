import {Player} from "@owlbear-rodeo/sdk";
import {Attribution} from "../../Attribution.tsx";
import {ChangeEvent} from "react";

export default function AttributionLine({attribution, players, onUpdate, onRemove}:
        {attribution: Attribution, players: Player[], onUpdate: (attribution: Attribution) => void, onRemove: () => void}) {
    function updateIn(evt: ChangeEvent<HTMLInputElement>) {
        attribution.in = evt.target.value;
        onUpdate(attribution);
    }
    
    function updateOut(evt: ChangeEvent<HTMLSelectElement>) {
        attribution.out = evt.target.value;
        onUpdate(attribution);
    }
    
    return (
        <div className="attribution">
            <input onChange={updateIn} value={attribution.in}></input>
            <select onChange={updateOut} value={attribution.out}>
                <option value="auto">(Auto)</option>
                <option value="none">(Do Not Attribute)</option>
                {players.map((p) =>
                    <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button onClick={onRemove}>-</button>
        </div>
    );
}