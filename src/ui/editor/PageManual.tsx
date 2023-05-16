import ConfigEditor from "./ConfigEditor.tsx";

export default function PageManual({setPage}: {setPage: (page: string)=>void}) {
    return (
        <>
            <h1>Manual Setup</h1>

            <ConfigEditor onBack={() => setPage("main")} />
        </>
        );
}