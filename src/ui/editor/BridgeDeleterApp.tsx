export default function BridgeDeleterApp() {
    
    const params = new URLSearchParams(window.location.search);
    
    return (
        <div>
            <h1>Delete Source</h1>
            Are you sure you want to delete {params.get("name")}?
        </div>
    )
}