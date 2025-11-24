import { useCallback, useEffect, useState } from "react";
import type { ConversationRoomType } from "./chatTypes";
import chatApi from "@/api/chatApi";

function useConversationRooms() {
    const [conversationRooms, setConversationRooms] = useState<
        ConversationRoomType[]
    >([]);

    const fetchConversationRooms = useCallback(async () => {
        const { conversationRooms: conversationRoomsRes } =
            await chatApi.getConversationRooms();

        setConversationRooms(conversationRoomsRes);
    }, []);

    useEffect(() => {
        fetchConversationRooms();
    }, [fetchConversationRooms]);

    useEffect(() => {
        // passed from useAuth when a request is joined ( new conversation initiated by other users )
        const handler = () => {
            fetchConversationRooms();
        };
        window.addEventListener("joinRequest", handler as EventListener);

        return () =>
            window.removeEventListener("joinRequest", handler as EventListener);
    }, [fetchConversationRooms]);

    return { conversationRooms };
}

export default useConversationRooms;
