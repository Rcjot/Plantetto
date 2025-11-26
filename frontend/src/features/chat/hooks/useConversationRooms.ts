import { useCallback, useEffect, useRef, useState } from "react";
import type { ConversationRoomType } from "../chatTypes";
import chatApi from "@/api/chatApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import socket from "@/lib/socket";

function useConversationRooms() {
    const [search, setSearch] = useState("");
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [conversationRooms, setConversationRooms] = useState<
        ConversationRoomType[]
    >([]);
    const initialFetch = useRef(false);

    const { auth } = useAuthContext()!;

    const fetchConversationRooms = useCallback(
        async (resetCursor = false) => {
            setLoading(true);
            const modifiedNextCursor = resetCursor ? null : nextCursor;

            const {
                conversationRooms: conversationRoomsRes,
                nextCursor: nextCursorRes,
            } = await chatApi.getConversationRooms(search, modifiedNextCursor);
            setHasMore(Boolean(nextCursorRes));
            setNextCursor(nextCursorRes);
            if (resetCursor) {
                setConversationRooms(conversationRoomsRes);
            } else {
                setConversationRooms((prev) => [
                    ...prev,
                    ...conversationRoomsRes,
                ]);
            }
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

    const refetchWithResetCursorIs = useCallback(
        (resetCursor: boolean) => {
            fetchConversationRooms(resetCursor);
        },
        [fetchConversationRooms]
    );

    useEffect(() => {
        if (!auth.user) return;
        // listens for new messages; can pass off as notifs for chatList
        const listenRoom = `${auth.user.id}_new_message`;
        const handler = () => {
            refetchWithResetCursorIs(true);
        };
        socket.on(listenRoom, handler);

        return () => {
            socket.off(listenRoom, handler);
        };
    }, [auth, refetchWithResetCursorIs]);

    return {
        conversationRooms,
        search,
        setSearch,
        refetchWithResetCursorIs,
        hasMore,
        loading,
    };
}

export default useConversationRooms;
