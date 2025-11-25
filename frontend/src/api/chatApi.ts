import axios from "@/lib/axios";
import type {
    ConversationRoomType,
    MessageType,
} from "@/features/chat/chatTypes";

async function getConversationRoom(username: string) {
    try {
        const { data } = await axios.get(`chat/room/${username}`);
        const conversation_room: ConversationRoomType =
            data["conversation_room"];
        return { ok: true, conversationRoom: conversation_room };
    } catch {
        return { ok: false, conversationRoom: null };
    }
}

async function getAllConversationRooms() {
    try {
        const { data } = await axios.get(`chat/rooms?limit=-1`);
        const conversationRooms: ConversationRoomType[] =
            data["conversation_rooms"];

        return {
            ok: true,
            conversationRooms: conversationRooms,
        };
    } catch {
        return { ok: false, conversationRooms: [] };
    }
}

async function getConversationRooms(search: string, nextCursor: string | null) {
    try {
        const { data } = await axios.get(
            `chat/rooms?search=${search}&cursor=${nextCursor}`
        );
        const conversationRooms: ConversationRoomType[] =
            data["conversation_rooms"];
        const nextCursorRes: string | null = data["next_cursor"];

        return {
            ok: true,
            conversationRooms: conversationRooms,
            nextCursor: nextCursorRes,
        };
    } catch {
        return { ok: false, conversationRooms: [], nextCursor: null };
    }
}

async function getConversationMessages(
    conversationRoomUuid: string,
    nextCursor: number | null
) {
    try {
        const { data } = await axios.get(
            `chat/room/${conversationRoomUuid}/messages?cursor=${nextCursor}`
        );
        const messages: MessageType[] = data["messages"];
        const nextCursorRes: number | null = data["next_cursor"];
        return { ok: true, messages: messages, nextCursor: nextCursorRes };
    } catch {
        return { ok: false, messages: [], nextCursor: null };
    }
}

async function getConversationByUuid(conversationRoomUuid: string) {
    try {
        const { data } = await axios.get(`chat/room/${conversationRoomUuid}`);
        const conversationRoom: ConversationRoomType =
            data["conversation_room"];
        return { ok: true, conversationRoom: conversationRoom };
    } catch {
        return { ok: false, conversationRoom: null };
    }
}

export default {
    getConversationRoom,
    getAllConversationRooms,
    getConversationRooms,
    getConversationMessages,
    getConversationByUuid,
};
