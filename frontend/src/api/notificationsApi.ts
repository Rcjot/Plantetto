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

export default { getNotifications };
