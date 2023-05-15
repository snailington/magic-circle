import ReactDOM from 'react-dom/client'
import '../configurator/index.css'
import WaitForOwlbear from "../configurator/WaitForOwlbear.tsx";
import BridgeDeleterApp from "./BridgeDeleterApp.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <WaitForOwlbear>
        <BridgeDeleterApp />
    </WaitForOwlbear>
    );
