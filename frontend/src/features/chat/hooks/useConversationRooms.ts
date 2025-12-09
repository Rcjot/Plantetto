import { useCallback, useEffect, useRef, useState } from "react";
import type { ConversationRoomType } from "../chatTypes";
import chatApi from "@/api/chatApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import socket from "@/lib/socket";

function useConversationRooms() {
    const [search, setSearch] = useState("");
    const nextCursor = useRef<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [conversationRooms, setConversationRooms] = useState<
        ConversationRoomType[]
    >([]);
    const [isAllState, setIsAllState] = useState(true);
    const initialFetch = useRef(false);

    const { auth } = useAuthContext()!;

    const fetchConversationRooms = useCallback(
        async (resetCursor = false, isAll = isAllState) => {
            setLoading(true);
            const modifiedNextCursor = resetCursor ? null : nextCursor.current;

            const {
                conversationRooms: conversationRoomsRes,
                nextCursor: nextCursorRes,
            } = await chatApi.getConversationRooms(
                search,
                modifiedNextCursor,
                isAll
            );
            setHasMore(Boolean(nextCursorRes));
            // setNextCursor(nextCursorRes);
            nextCursor.current = nextCursorRes;
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
        [search, isAllState]
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
        (resetCursor: boolean, isAll = isAllState) => {
            fetchConversationRooms(resetCursor, isAll);
        },
        [fetchConversationRooms, isAllState]
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

    function toggleIsAllState(isAll: boolean) {
        setIsAllState(isAll);
        refetchWithResetCursorIs(true, isAll);
    }

    return {
        conversationRooms,
        search,
        setSearch,
        refetchWithResetCursorIs,
        hasMore,
        loading,
        isAllState,
        toggleIsAllState,
    };
}

export default useConversationRooms;