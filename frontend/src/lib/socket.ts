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

export function readMessage(
    user: UserType,
    username: string,
    message_id: number,
    conversation_uuid: string
) {
    socket.emit("read_message", {
        user: user,
        username: username,
        message_id: message_id,
        conversation_uuid: conversation_uuid,
    });
}

export function followNotify(follower: UserType, following: UserType) {
    console.log(follower, following);
    socket.emit("follow", { follower: follower, following: following });
}

export default socket;
