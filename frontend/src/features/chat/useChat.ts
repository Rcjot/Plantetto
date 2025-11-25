import { useCallback, useEffect, useRef, useState } from "react";
import type { MessageType } from "./chatTypes";
import chatApi from "@/api/chatApi";

function useChat(conversationRoomUuid: string | null) {
    const [messages, setMessages] = useState<MessageType[] | null>(
        conversationRoomUuid ? null : []
    );
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const initialFetch = useRef(false);

    const fetchMessages = useCallback(async () => {
        if (conversationRoomUuid) {
            setLoading(true);
            const { messages: messagesRes, nextCursor: nextCursorRes } =
                await chatApi.getConversationMessages(
                    conversationRoomUuid,
                    nextCursor
                );

            setMessages((prev) => [...(prev ?? []), ...messagesRes]);
            setHasMore(Boolean(nextCursorRes));
            setNextCursor(nextCursorRes);
            setLoading(false);
        }
    }, [conversationRoomUuid, nextCursor]);

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;

        fetchMessages();
    }, [fetchMessages]);

    return { messages, setMessages, fetchMessages, hasMore, loading };
}

export default useChat;
