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

  // fetchConversationRooms now accepts the cursor to avoid stale closure issues
  const fetchConversationRooms = useCallback(
    async (resetCursor = false, cursorArg: string | null = null) => {
      setLoading(true);

      // decide which cursor to use: passed-in arg overrides state (useful for resets)
      const modifiedNextCursor = resetCursor ? null : (cursorArg ?? nextCursor);

      try {
        const res = await chatApi.getConversationRooms(search, modifiedNextCursor);

        // normalize response shape defensively
        const conversationRoomsRes = Array.isArray(res?.conversationRooms)
          ? res.conversationRooms
          : Array.isArray(res)
          ? res
          : res?.data && Array.isArray(res.data)
          ? res.data
          : [];

        const nextCursorRes = res?.nextCursor ?? null;

        setHasMore(Boolean(nextCursorRes));
        setNextCursor(nextCursorRes);

        if (resetCursor) {
          setConversationRooms(conversationRoomsRes);
        } else {
          // merge new page into existing state
          setConversationRooms((prev) => {
            // guard against duplicates (optional) — using uuid if present
            if (!Array.isArray(conversationRoomsRes) || conversationRoomsRes.length === 0)
              return prev;
            return [...prev, ...conversationRoomsRes];
          });
        }
      } catch (err) {
        console.error("Failed fetching conversation rooms", err);
        // on error, keep current list but ensure loading toggled off
      } finally {
        setLoading(false);
      }
    },
    // include search and nextCursor only if you want refetch triggered by them
    [nextCursor, search]
  );

  useEffect(() => {
    if (initialFetch.current) return;
    initialFetch.current = true;
    fetchConversationRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // pass null as cursorArg when resetting so the fetch uses start
      fetchConversationRooms(resetCursor, null);
    },
    [fetchConversationRooms]
  );

  useEffect(() => {
    if (!auth?.user) return;
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
