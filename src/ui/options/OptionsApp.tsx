import {ReactNode} from "react";

export default function OptionsApp() {
    interface Option {
        name: string,
        description: string,
        key: string,
        type: "text" | "checkbox",
    }
    
    const options: Option[] = [
        {
            name: "Route to Rumble",
            description: "If enabled, incoming message events will be routed to Rumble! chat.",
            key: "rumbleRouting",
            type: "checkbox"
        }
    ];
    
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
            {options.map((o, i) => generateOptions(o, i))}
        </form>
    )
}