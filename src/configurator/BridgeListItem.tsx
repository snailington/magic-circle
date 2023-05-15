import "./BridgeListItem.css"

export default function BridgeListItem() {
    return (
        <div className="bridge">
            <div className="bridge-name">Bridge Name</div>
            <div className="bridge-type">Bridge Type</div>
            <div className="bridge-status" />
            <button className="btn-bridge-open">open</button>
            <button className="btn-bridge-edit">edit</button>
            <button className="btn-bridge-delete">X</button>
        </div>
    )
}