import OwlbearTheme from "../configurator/OwlbearTheme.tsx";
import PageSetup from "./PageSetup.tsx";
import {ReactNode, useState} from "react";
import PageImport from "./PageImport.tsx";
import PageManual from "./PageManual.tsx";

export default function BridgeBuilderApp() {
    const [page, setPage] = useState("main");
    
    let currentPage: ReactNode = <PageSetup setPage={setPage} />;
    switch(page) {
        case "import": currentPage = <PageImport setPage={setPage} />; break;
        case "manual": currentPage = <PageManual setPage={setPage} />; break;
    }
    
    return (
        <OwlbearTheme>
            {currentPage}
        </OwlbearTheme>
        );
}