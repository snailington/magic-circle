export default function BridgeArgument({argInfo, value, updateArg}:
        {argInfo: {id: string, name: string, description: string}, value: string,
            updateArg: (key: string, value: string) => void}) {
    
    const propId = "arg-" + argInfo.id;
    return (
        <>
            <div className="property">
                <label htmlFor={propId}>{argInfo.name}</label>
                <input id={propId} value={value} onChange={(e) => updateArg(argInfo.id, e.target.value)}></input>
            </div>
            <p className="property-description">{argInfo.description}</p>
        </>
    );
}