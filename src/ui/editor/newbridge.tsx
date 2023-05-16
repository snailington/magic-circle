import ReactDOM from 'react-dom/client'
import BridgeBuilderApp from './BridgeBuilderApp.tsx'
import '../configurator/index.css'
import WaitForOwlbear from "../configurator/WaitForOwlbear.tsx";

import "./index.css"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <WaitForOwlbear>
        <BridgeBuilderApp />
    </WaitForOwlbear>
    );
