import { useCallback, useEffect, useRef, useState } from "react";
import type { MessageType } from "../chatTypes";
import chatApi from "@/api/chatApi";

export interface PassMessageType {
    messages: MessageType[] | null;
    changeType: "prepend" | "append";
}

function useChat(conversationRoomUuid: string | null) {
    const [messagesObj, setMessages] = useState<PassMessageType>({
        messages: conversationRoomUuid ? null : [],
        changeType: "append",
    });
    // room uuid is null if its fresh convo

    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const initialFetch = useRef(false);
    // set initialfetch to avoid further fetching of messages while its mounted
    // due to the nature of how it fetches, it will append new fetched messages to current messages state

    // full reset fetching of messages only happens if this unmounts
    //      that is when visiting a new room from chat list
    //      or a page reload.
    // while mount message updates are handled with sockets

    const fetchMessages = useCallback(async () => {
        // at default will be prepend
        if (conversationRoomUuid) {
            setLoading(true);
            const { messages: messagesRes, nextCursor: nextCursorRes } =
                await chatApi.getConversationMessages(
                    conversationRoomUuid,
                    nextCursor
                );
            setMessages((prev) => ({
                messages: [...(prev.messages ?? []), ...messagesRes],
                changeType: "prepend",
            }));
            setHasMore(Boolean(nextCursorRes));
            setNextCursor(nextCursorRes);
            setLoading(false);
        }
    }, [conversationRoomUuid, nextCursor]);

    useEffect(() => {
        // for new convo, room uuid is set to null
        // when convo room is created, this component won't unmount, as the room state is only changed
        // do not set initialfetch to true if convo room is null.
        if (!conversationRoomUuid || initialFetch.current) return;
        initialFetch.current = true;

        fetchMessages();
    }, [fetchMessages, conversationRoomUuid]);

    const appendMessage = useCallback((newMessage: MessageType) => {
        setMessages((prev) => ({
            messages: [newMessage, ...(prev.messages ?? [])],
            changeType: "append",
        }));
    }, []);

    return {
        messagesObj,
        appendMessage,
        fetchMessages,
        hasMore,
        loading,
    };
}

export default useChat;
