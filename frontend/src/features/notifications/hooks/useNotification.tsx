import { useCallback, useEffect, useRef, useState } from "react";
import type { NotificationType } from "../notificationTypes";
import notificationsApi from "@/api/notificationsApi";
import socket from "@/lib/socket";

function useNotification() {
    const [notifs, setNotifs] = useState<NotificationType[] | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const initialFetch = useRef(false);
    const nextCursor = useRef<number | null>(null);

    const fetchNotifications = useCallback(async (isReset = false) => {
        setLoading(true);
        const { notifications: notifsRes, nextCursor: nextCursorRes } =
            await notificationsApi.getNotifications(nextCursor.current);
        if (isReset) {
            setNotifs(notifsRes);
        } else {
            setNotifs((prev) => [...(prev ?? []), ...notifsRes]);
        }
        setHasMore(Boolean(nextCursorRes));
        nextCursor.current = nextCursorRes;
        setLoading(false);
    }, []);

    async function markAllRead() {
        await notificationsApi.markAllRead();
        nextCursor.current = null;
        fetchNotifications(true);
    }

    async function markNotificationRead(notificationId: number) {
        setDropdownOpen(false);
        await notificationsApi.markNotificationRead(notificationId);
        fetchNotifications();
    }

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        const handler = () => {
            nextCursor.current = null;
            fetchNotifications(true);
        };
        socket.on("notify", handler);

        return () => {
            socket.off("notify", handler);
        };
    });

    return {
        notifs,
        markAllRead,
        markNotificationRead,
        dropdownOpen,
        setDropdownOpen,
        hasMore,
        loading,
        fetchNotifications,
    };
}

export default useNotification;
