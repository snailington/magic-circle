export interface Option {
    name: string,
    description: string,
    key: string,
    type: "text" | "checkbox",
}

export const optionsList: Option[] = [
    {
        name: "Route to Rumble",
        description: "If enabled, incoming message events will be routed to Rumble! chat.",
        key: "rumbleRouting",
        type: "checkbox"
    },
    {
        name: "Test textbox",
        description: "just a box",
        key: "testValue",
        type: "text"
    }
];