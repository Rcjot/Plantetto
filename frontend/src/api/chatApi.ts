import axios from "@/lib/axios";

async function getConversationRoom(username: string) {
    try {
        const { data } = await axios.get(`chat/${username}`);
        return { ok: true, conversationRoom: data["conversation_room"] };
    } catch {
        return { ok: false, conversationRoom: null };
    }
}

export default {
    getConversationRoom,
};
