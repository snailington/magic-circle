import {BridgeDefinition} from "../../BridgeDirectory.ts";
import BridgeArgument from "./BridgeArgument.tsx";
import {BridgeConfig} from "../../BridgeConfig.ts";

export default function BridgeArgumentList({bridgeDef, config, updateArg}:
        {bridgeDef: BridgeDefinition | undefined, config: BridgeConfig,
            updateArg: (key: string, value: string) => void}) {

    return (
        <>
        { bridgeDef?.args.map((arg) =>
            <BridgeArgument key={`ba-${arg.id}`} argInfo={arg} updateArg={updateArg}
                value={ typeof config[arg.id] === "string" ? config[arg.id] as string : "" }/>) }
        </>
    );
}