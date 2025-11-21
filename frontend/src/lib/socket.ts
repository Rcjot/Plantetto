const serverURL = import.meta.env.VITE_SERVER_URL;
import { io } from "socket.io-client";

const socket = io(serverURL);

export function joinRooms() {
    socket.emit("join_rooms");
}

export default socket;
