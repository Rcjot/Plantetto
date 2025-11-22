const serverURL = import.meta.env.VITE_SERVER_URL;
import { io } from "socket.io-client";

const socket = io(serverURL);

export function joinRooms() {
    socket.emit("join_rooms");
}

export function joinRoom(username: string, room: string) {
    socket.emit("join", { username: username, room: room });
}

export function sendMessage(username: string, message: string, room: string) {
    socket.emit("chat_message", {
        username: username,
        message: message,
        room: room,
    });
}

export default socket;
