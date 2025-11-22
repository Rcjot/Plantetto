const serverURL = import.meta.env.VITE_SERVER_URL;
import type { UserType } from "@/features/auth/authTypes";
import { io } from "socket.io-client";

const socket = io(serverURL, { autoConnect: false });

export function joinRooms(username: string) {
    socket.emit("join_rooms", username);
}

export function joinRoom(username: string, room: string) {
    socket.emit("join", { username: username, room: room });
}

export function sendMessage(
    sender: UserType,
    sender_username: string,
    recipient_username: string,
    message: string,
    room: string | null
) {
    socket.emit("chat_message", {
        sender: sender,
        sender_username: sender_username,
        recipient_username: recipient_username,
        message: message,
        room: room,
    });
}

export default socket;
