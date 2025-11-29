import axios from "@/lib/axios";
import type { NotificationType } from "@/features/notifications/notificationTypes";

async function getNotifications() {
    try {
        const { data } = await axios.get(`/notifications/`);
        const notifications: NotificationType[] = data["notifications"];
        return { ok: true, notifications: notifications };
    } catch {
        return { ok: false, notifications: [] };
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
