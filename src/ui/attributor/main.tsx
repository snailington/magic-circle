import ReactDOM from "react-dom/client";
import WaitForOwlbear from "../WaitForOwlbear.tsx";
import AttributorApp from "./AttributorApp.tsx";
import "../common.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <WaitForOwlbear>
        <AttributorApp/>
    </WaitForOwlbear>
    );
