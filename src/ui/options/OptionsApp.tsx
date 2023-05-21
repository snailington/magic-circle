import {ReactNode} from "react";
import {Option, optionsList} from "./options.ts";

export default function OptionsApp() {
    function generateOptions(option: Option, index: number): ReactNode {
        const id = "option-" + index;
        const currentValue = window.localStorage.getItem(option.key);
        
        const inputAttr: any = {};
        if(option.type == "checkbox") inputAttr["checked"] = currentValue == "on";
        
        const inputElement = <input id={id} type={option.type} onChange={(evt) => {
            const value = evt.target.value || evt.target.checked;
            console.log(`onchange: ${option.key} ${evt.target.value} ${evt.target.checked}`);
            window.localStorage.setItem(option.key, value.toString());
        }} {...inputAttr}></input>;
        
        return (
            <div key={id} className="option-row">
                <div>
                    <label htmlFor={id}>{option.name}</label>
                    {inputElement}
                </div>
                <div>
                    {option.description}
                </div>
            </div>
        )
    }
    
    return (
        <form>
            {optionsList.map((o, i) => generateOptions(o, i))}
        </form>
    )
}