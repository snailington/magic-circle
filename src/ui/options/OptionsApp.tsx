import {ChangeEvent, ReactNode} from "react";
import {Option, optionsList} from "./options.ts";
import "./OptionsApp.css";
import OwlbearTheme from "../OwlbearTheme.tsx";

export default function OptionsApp() {
    function generateOptions(option: Option, index: number): ReactNode {
        const id = "option-" + index;
        const currentValue = window.localStorage.getItem(option.key);
        
        const inputAttr: any = {};
        switch(option.type) {
            case "checkbox":
                if(currentValue == "true") inputAttr["defaultChecked"] = true;
                inputAttr["onChange"] = (evt: ChangeEvent<HTMLInputElement>) =>
                    window.localStorage.setItem(option.key, evt.target.checked.toString());
                break;
            default:
                inputAttr["defaultValue"] = currentValue;
                inputAttr["onChange"] = (evt: ChangeEvent<HTMLInputElement>) =>
                    window.localStorage.setItem(option.key, evt.target.value);
        }

        const inputElement = <input id={id} type={option.type} {...inputAttr}></input>;
        
        return (
            <OwlbearTheme>
                <>
                    <h1>Magic Circle Options</h1>
                    <div key={id} className="option-row">
                        <label htmlFor={id}>{option.name}</label>
                        {inputElement}
                        <div>
                            {option.description}
                        </div>
                    </div>
                </>
            </OwlbearTheme>
        );
    }
    
    return (
        <form>
            {optionsList.map((o, i) => generateOptions(o, i))}
        </form>
    )
}