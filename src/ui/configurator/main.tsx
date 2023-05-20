import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import WaitForOwlbear from "../WaitForOwlbear.tsx";
import {BridgeStatusClient} from "../../BridgeStatus.ts";
import OBR from "@owlbear-rodeo/sdk";

import "../common.css"
import './index.css'

const statusClient = new BridgeStatusClient();
OBR.onReady(() => statusClient.start());

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <WaitForOwlbear>
            <App />
        </WaitForOwlbear>
    );
