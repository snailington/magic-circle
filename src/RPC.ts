export interface RPC {
    cmd:
        "open" | "config" | "ping" | "pong" |
        "set" | "set-item" | "get" | "msg" |
        "reply" |
        "error"
}

export interface OpenRPC extends RPC {
    cmd: "open",
    version: number,
    room: string
}

// Configure the dispatcher (requires control access)
export interface ConfigRPC extends RPC {
    cmd: "config",
    subcmd: "reload",
    args: any
}

type TargetType = "room" | "scene" | "item" | "player";

// Get a value stored in metadata (expects reply)
export interface GetRPC extends RPC {
    cmd: "get",
    target: TargetType,
    // if target == "item", the guid of the item in question
    item: string | undefined,
    // the metadata key to retrieve
    key: string,
    // will be included in the reply
    reply_id: number
}

// Set a value stored in metadata
export interface SetRPC extends RPC {
    cmd: "set",
    target: TargetType,
    // if target == "item", the guid of the item in question
    item: string | undefined,
    // the metadata key to set
    key: string,
    // the new value to be set
    value: any
}

// Set a property associated with an item
export interface SetItemRPC extends RPC {
    cmd: "set-item",
    item: string,
    key: string,
    value: any
}

// Send a message
export interface MsgRPC extends RPC {
    cmd: "msg",
    type: "chat" | "dice" | "info",
    text: string,
    author: string | undefined,
    
    time: number | undefined,
    
    // optional additional data to be passed 
    metadata: any
}

// Send a dice roll
export interface DiceRPC extends MsgRPC {
    cmd: "msg",
    type: "dice",
    
    metadata: {
        // an array of the types of all the individual dice to be rolled
        dice: string[],

        // a modifier to be added to the total sum of the dice
        modifier: number | undefined,

        //  if dice roll results are predetermined, an array of the results of
        // the rolls corresponding to the dice array
        results: number[] | undefined
    }
}

// Reply to a previous RPC 
export interface ReplyRPC extends RPC {
    cmd: "reply",
    reply_id: number,
    value: any
}

export interface ErrorRPC extends RPC {
    cmd: "error",
    msg: string
}