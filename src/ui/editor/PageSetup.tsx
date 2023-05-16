export default function PageSetup({setPage}: {setPage: (page: string)=>void}) {
    return(
        <>
            <h1>Setup a Source</h1>
            <p>
                Magic Circle takes the data provided by a source and shares it
                with compatible extensions. If you were provided config for a
                source, you can click here to easily import it:
            </p>
            <button onClick={()=>setPage("import")}>Import a Source</button>
            <h2>or</h2>
            <button onClick={()=>setPage("manual")}>Manual Setup</button>
        </>
    );
}