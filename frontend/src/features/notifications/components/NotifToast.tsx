import ProfilePicture from "@/components/ProfilePicture";
import type {
    LikePayloadType,
    NotificationType,
    PayloadType,
} from "../notificationTypes";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface NotificationBlockProps {
    notification: NotificationType;
    markNotificationRead: (notifId: number) => Promise<void>;
}

function NotifToast({
    notification,
    markNotificationRead,
}: NotificationBlockProps) {
    const navigate = useNavigate();
    let content;
    const notification_type = notification.notification_type;
    if (notification_type === "follow") {
        const payload = notification.payload as PayloadType;
        const actor = payload.actor;

        content = (
            <>
                <div
                    className="flex gap-3 cursor-pointer"
                    onClick={() => {
                        navigate(`/${actor.username}`);
                        markNotificationRead(notification.id);
                    }}
                >
                    <ProfilePicture src={actor.pfp_url} />
                    <div>
                        <h1 className="text-sm">
                            {actor.display_name ?? actor.username}
                        </h1>
                        <p className="text-xs">has followed you</p>
                    </div>
                    <div className="ml-auto">
                        {dayjs(notification.created_at).format("h:mm A")}

                        <br />
                        <br />
                        {dayjs(notification.created_at).format("MMM D")}
                    </div>
                </div>
            </>
        );
    } else if (
        notification_type == "like_post" ||
        notification_type == "like_guide"
    ) {
        const payload = notification.payload as LikePayloadType;
        const actor = payload.actor;
        content = (
            <>
                <div
                    className="flex gap-3 cursor-pointer"
                    onClick={() => {
                        navigate(`/${actor.username}`);
                        markNotificationRead(notification.id);
                    }}
                >
                    <ProfilePicture src={actor.pfp_url} />
                    <div>
                        <h1 className="text-sm">
                            {actor.display_name ?? actor.username}
                        </h1>
                        <p className="text-xs">
                            has liked your{" "}
                            {notification_type === "like_guide"
                                ? "guide"
                                : "post"}
                        </p>
                    </div>
                    <div className="ml-auto">
                        {dayjs(notification.created_at).format("h:mm A")}

                        <br />
                        <br />
                        {dayjs(notification.created_at).format("MMM D")}
                    </div>
                </div>
            </>
        );
    } else if (
        notification_type == "post" ||
        notification_type == "guide" ||
        notification_type == "diary"
    ) {
        const payload = notification.payload as LikePayloadType;
        const actor = payload.actor;
        content = (
            <>
                <div
                    className="flex gap-3 cursor-pointer"
                    onClick={() => {
                        if (notification_type == "post") {
                            navigate(
                                `/home/${actor.username}/${payload.entity_uuid}`
                            );
                        } else if (notification_type == "guide") {
                            navigate(`/guides/${payload.entity_uuid}`);
                        } else {
                            navigate(`/home`);
                        }
                        markNotificationRead(notification.id);
                    }}
                >
                    <ProfilePicture src={actor.pfp_url} />
                    <div>
                        <h1 className="text-sm">
                            {actor.display_name ?? actor.username}
                        </h1>
                        <p className="text-xs">
                            {notification_type === "guide"
                                ? "has published a new guide"
                                : notification_type === "post"
                                  ? "has sprouted a new post"
                                  : "added a new diary entry"}
                        </p>
                    </div>
                    <div className="ml-auto">
                        {dayjs(notification.created_at).format("h:mm A")}

                        <br />
                        <br />
                        {dayjs(notification.created_at).format("MMM D")}
                    </div>
                </div>
            </>
        );
    }

    return (
        <div>
            <div className="card bg-none card-xs ">
                <div className="card-body">{content}</div>
            </div>
        </div>
    );
}

export default NotifToast;
