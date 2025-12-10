import axios from "@/lib/axios";
import type { NotificationType } from "@/features/notifications/notificationTypes";

async function getNotifications(nextCursor: number | null) {
    try {
        const { data } = await axios.get(
            `/notifications/?cursor=${nextCursor}`
        );
        const notifications: NotificationType[] = data["notifications"];
        const nextCursorRes: number | null = data["next_cursor"];
        return {
            ok: true,
            notifications: notifications,
            nextCursor: nextCursorRes,
        };
    } catch {
        return { ok: false, notifications: [], nextCursor: null };
    }
}

async function getNotification(entityUuid: string, notifType: string) {
    try {
        const { data } = await axios.get(
            `/notifications/${entityUuid}?notif_type=${notifType}`
        );
        const notification: NotificationType = data["notification"];
        console.log(notification, entityUuid);
        return {
            ok: true,
            notification: notification,
        };
    } catch {
        return { ok: false, notification: null };
    }
}

async function markAllRead() {
    try {
        await axios.patch(`/notifications/`);
        return { ok: true };
    } catch {
        return { ok: false };
    }
}

async function markNotificationRead(notificationId: number) {
    try {
        await axios.patch(`/notifications/${notificationId}`);
        return { ok: true };
    } catch {
        return { ok: false };
    }
}

export default {
    getNotifications,
    getNotification,
    markAllRead,
    markNotificationRead,
};
