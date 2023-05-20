import ReactDOM from "react-dom/client";
import WaitForOwlbear from "../WaitForOwlbear.tsx";
import OptionsApp from "./OptionsApp.tsx";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <WaitForOwlbear>
        <OptionsApp/>
    </WaitForOwlbear>
    );
