import Room from "./Room.tsx";
import IRoomInfo from "./IRoomInfo.ts";

export default function RoomList() {
    const list = [];
    const rooms = JSON.parse(window.localStorage.getItem("magic-circle-rooms") || "{}");
    for(const room of rooms) {
        list.push(rooms[room]);
    }
    
    return (
        <div id="room-list">
            {rooms.map((r: IRoomInfo) => <Room room={r} />)}
        </div>
    )
}