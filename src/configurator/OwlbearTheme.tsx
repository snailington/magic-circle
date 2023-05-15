import {ReactElement, useEffect, useState} from "react";
import OBR from "@owlbear-rodeo/sdk";

export default function OwlbearTheme({ children }: { children: ReactElement | ReactElement[] }) {
    const [currentTheme, setCurrentTheme] = useState("dark");
    
    useEffect(() => {
        OBR.theme.getTheme().then((theme) => {
           setCurrentTheme(theme.mode.toLowerCase()); 
        });
        
        return OBR.theme.onChange((theme) => {
            setCurrentTheme(theme.mode.toLowerCase());
        });
    }, []);
    
    return (
        <div className={`theme-${currentTheme}`}>
            {children}
        </div>
    );
}