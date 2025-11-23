import { useEffect, useState } from "react";
import type { ConversationRoomType } from "./chatTypes";
import chatApi from "@/api/chatApi";

function useConversationRooms() {
    const [conversationRooms, setConversationRooms] = useState<
        ConversationRoomType[]
    >([]);

    useEffect(() => {
        const fetchConversationRooms = async () => {
            const { conversationRooms: conversationRoomsRes } =
                await chatApi.getConversationRooms();

            setConversationRooms(conversationRoomsRes);
        };
        fetchConversationRooms();
    }, []);

    return { conversationRooms };
}

export default useConversationRooms;
