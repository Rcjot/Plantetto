import { useCallback, useEffect, useState } from "react";
import type { NotificationType } from "../notificationTypes";
import notificationsApi from "@/api/notificationsApi";
import socket from "@/lib/socket";

function useNotification() {
    const [notifs, setNotifs] = useState<NotificationType[] | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        const { notifications } = await notificationsApi.getNotifications();
        setNotifs(notifications);
    }, []);

    async function markAllRead() {
        await notificationsApi.markAllRead();
        fetchNotifications();
    }

    async function markNotificationRead(notificationId: number) {
        setDropdownOpen(false);
        await notificationsApi.markNotificationRead(notificationId);
        fetchNotifications();
    }

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        const handler = () => {
            fetchNotifications();
        };
        socket.on("followed", handler);

        return () => {
            socket.off("followed", handler);
        };
    });

    return {
        notifs,
        markAllRead,
        markNotificationRead,
        dropdownOpen,
        setDropdownOpen,
    };
}

export default useNotification;
