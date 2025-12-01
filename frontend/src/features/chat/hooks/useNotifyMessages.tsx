import { useAuthContext } from "@/features/auth/AuthContext";
import { useCallback, useEffect, useState } from "react";
import chatApi from "@/api/chatApi";
import socket from "@/lib/socket";
import { toast } from "react-toastify";
import ChatNotifToast from "../components/ChatNotifToast";
import type { MessageType } from "../chatTypes";

function useNotifyMessages({ dropdownOpen }: { dropdownOpen: boolean }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const { auth } = useAuthContext()!;

    const fetchUnreadCount = useCallback(async () => {
        const { conversationRooms: conversationRoomsRes } =
            await chatApi.getConversationRooms("", null, false);

        setUnreadCount(conversationRoomsRes.length);
    }, []);

    useEffect(() => {
        fetchUnreadCount();
    }, [fetchUnreadCount]);

    useEffect(() => {
        // event passed from useAuth when a request is joined ( new conversation initiated by other users )
        // event passed from receiving new messages
        const handler = () => {
            fetchUnreadCount();
        };
        window.addEventListener("refetchChatList", handler as EventListener);

        return () =>
            window.removeEventListener(
                "refetchChatList",
                handler as EventListener
            );
    }, [fetchUnreadCount]);

    useEffect(() => {
        if (!auth.user) return;
        // listens for new messages; can pass off as notifs for chatList
        const listenRoom = `${auth.user.id}_new_message`;
        const handler = (payload: MessageType) => {
            fetchUnreadCount();
            console.log(dropdownOpen);
            if (!dropdownOpen) {
                toast.info(<ChatNotifToast message={payload} />, {
                    closeOnClick: true,
                });
            }
        };
        socket.on(listenRoom, handler);

        return () => {
            socket.off(listenRoom, handler);
        };
    }, [auth, fetchUnreadCount, dropdownOpen]);

    return { unreadCount, fetchUnreadCount };
}

export default useNotifyMessages;
