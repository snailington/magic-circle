import ReactDOM from 'react-dom/client'
import WaitForOwlbear from "../configurator/WaitForOwlbear.tsx";
import BridgeDeleterApp from "./BridgeDeleterApp.tsx";
import "./index.css"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <WaitForOwlbear>
        <BridgeDeleterApp />
    </WaitForOwlbear>
    );
