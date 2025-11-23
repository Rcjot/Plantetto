import axios from "@/lib/axios";
import type {
    ConversationRoomType,
    MessageType,
} from "@/features/chat/chatTypes";

async function getConversationRoom(username: string) {
    try {
        const { data } = await axios.get(`chat/room/${username}`);
        return { ok: true, conversationRoom: data["conversation_room"] };
    } catch {
        return { ok: false, conversationRoom: null };
    }
}

async function getConversationRooms() {
    try {
        const { data } = await axios.get(`chat/rooms`);
        const conversationRooms: ConversationRoomType[] =
            data["conversation_rooms"];
        return { ok: true, conversationRooms: conversationRooms };
    } catch {
        return { ok: false, conversationRooms: [] };
    }
}

async function getConversationMessages(conversationRoomUuid: string) {
    try {
        const { data } = await axios.get(
            `chat/room/${conversationRoomUuid}/messages`
        );
        const messages: MessageType[] = data["messages"];
        console.log(messages);
        return { ok: true, messages: messages };
    } catch {
        return { ok: false, messages: [] };
    }
}

export default {
    getConversationRoom,
    getConversationRooms,
    getConversationMessages,
};
