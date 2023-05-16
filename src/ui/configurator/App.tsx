import BridgeList from "./BridgeList.tsx";
import OwlbearTheme from "./OwlbearTheme.tsx";
import ControlPanel from "./ControlPanel.tsx";
import "./App.css"
import ConfigWatcher from "./ConfigWatcher.tsx";

export default function App() {
    return (
        <OwlbearTheme>
            <div id="container">
                <BridgeList />
                <ControlPanel />
            </div>
        </OwlbearTheme>
    );
}