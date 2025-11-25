import { useCallback, useEffect, useRef, useState } from "react";
import type { ConversationRoomType } from "../chatTypes";
import chatApi from "@/api/chatApi";

function useConversationRooms() {
    const [search, setSearch] = useState("");
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [conversationRooms, setConversationRooms] = useState<
        ConversationRoomType[]
    >([]);
    const initialFetch = useRef(false);

    const fetchConversationRooms = useCallback(
        async (resetCursor = false) => {
            setLoading(true);
            console.log(resetCursor);
            const modifiedNextCursor = resetCursor ? null : nextCursor;

            const {
                conversationRooms: conversationRoomsRes,
                nextCursor: nextCursorRes,
            } = await chatApi.getConversationRooms(search, modifiedNextCursor);

            setHasMore(Boolean(nextCursorRes));
            setNextCursor(nextCursorRes);
            setConversationRooms(conversationRoomsRes);
            setLoading(false);
        },
        [nextCursor, search]
    );

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        fetchConversationRooms();
    }, [fetchConversationRooms]);

    useEffect(() => {
        // event passed from useAuth when a request is joined ( new conversation initiated by other users )
        // event passed from receiving new messages
        const handler = () => {
            fetchConversationRooms(true);
        };
        window.addEventListener("refetchChatList", handler as EventListener);

        return () =>
            window.removeEventListener(
                "refetchChatList",
                handler as EventListener
            );
    }, [fetchConversationRooms]);

    function onSubmit(resetCursor: boolean) {
        fetchConversationRooms(resetCursor);
    }

    return { conversationRooms, search, setSearch, onSubmit, hasMore, loading };
}

export default useConversationRooms;
