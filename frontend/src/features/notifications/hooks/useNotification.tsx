import { useCallback, useEffect, useRef, useState } from "react";
import type { EntityPayloadType, NotificationType } from "../notificationTypes";
import notificationsApi from "@/api/notificationsApi";
import socket from "@/lib/socket";
import { toast } from "react-toastify";
import NotifToast from "../components/NotifToast";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/AuthContext";

function useNotification() {
    const [notifs, setNotifs] = useState<NotificationType[] | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const initialFetch = useRef(false);
    const nextCursor = useRef<number | null>(null);

    const { auth } = useAuthContext()!;

    const navigate = useNavigate();

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
        nextCursor.current = null;
        fetchNotifications(true);
    }

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        const handler = async (newNotif: {
            payload: NotificationType | EntityPayloadType;
            notif_type: string;
        }) => {
            nextCursor.current = null;
            fetchNotifications(true);
            console.log(newNotif, "newnotif");
            const notifType = newNotif["notif_type"];

            if (notifType == "follow" || notifType == "like") {
                const notification: NotificationType = newNotif[
                    "payload"
                ] as NotificationType;
                toast.info(<NotifToast notification={notification} />, {
                    closeOnClick: true,
                    icon: false,
                    onClick: () => {
                        markNotificationRead(notification.id);
                        if (notifType == "follow") {
                            navigate(`/${notification.payload.actor.username}`);
                        } //put else if here for like and comments
                    },
                });
            } else {
                const notification: EntityPayloadType = newNotif[
                    "payload"
                ] as EntityPayloadType;
                console.log(notification);
                const { notification: notificationRes } =
                    await notificationsApi.getNotification(
                        notification.entity_uuid,
                        notifType
                    );
                if (notificationRes) {
                    toast.info(<NotifToast notification={notificationRes} />, {
                        closeOnClick: true,
                        icon: false,
                        onClick: () => {
                            markNotificationRead(notificationRes.id);
                            const payload =
                                notificationRes.payload as EntityPayloadType;
                            if (notifType == "post") {
                                navigate(
                                    `/home/${notificationRes.payload.actor.username}/${payload.entity_uuid}`
                                );
                            } else if (
                                notifType == "guide" ||
                                notifType == "comment_guide"
                            ) {
                                navigate(`/guides/${payload.entity_uuid}`);
                            } else if (notifType == "comment_post") {
                                navigate(
                                    `/home/${auth.user?.username}/${payload.entity_uuid}`
                                );
                            } else {
                                navigate(`/home`);
                            }
                        },
                    });
                }
            }
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
