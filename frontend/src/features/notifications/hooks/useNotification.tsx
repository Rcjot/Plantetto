import { useCallback, useEffect, useState } from "react";
import type { NotificationType } from "../notificationTypes";
import notificationsApi from "@/api/notificationsApi";
import socket from "@/lib/socket";

function useNotification() {
    const [notifs, setNotifs] = useState<NotificationType[] | null>(null);

    const fetchNotifications = useCallback(async () => {
        const { notifications } = await notificationsApi.getNotifications();
        setNotifs(notifications);
    }, []);

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

    return { notifs };
}

export default useNotification;
