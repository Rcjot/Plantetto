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

export default { getNotifications, markAllRead, markNotificationRead };
