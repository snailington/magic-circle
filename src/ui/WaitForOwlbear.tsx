import OBR from "@owlbear-rodeo/sdk";
import {ReactElement, useEffect, useState} from "react";

export default function WaitForOwlbear({ children }: { children: ReactElement }) {
    const [obrReady, setObrReady] = useState(false);
    
    useEffect(() => OBR.onReady(() => {
        setObrReady(true);
    }), []);
    
    if(obrReady) return children;
    return (<div className="obr-loading">Please Wait...</div>);
}