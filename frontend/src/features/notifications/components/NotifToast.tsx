import ProfilePicture from "@/components/ProfilePicture";
import type {
    EntityPayloadType,
    LikePayloadType,
    NotificationType,
    PayloadType,
} from "../notificationTypes";
import dayjs from "dayjs";

interface NotificationBlockProps {
    notification: NotificationType;
}

function NotifToast({ notification }: NotificationBlockProps) {
    let content;
    const notification_type = notification.notification_type;
    if (notification_type === "follow") {
        const payload = notification.payload as PayloadType;
        const actor = payload.actor;

        content = (
            <>
                <div className="flex gap-3 cursor-pointer w-full mr-5">
                    <ProfilePicture src={actor.pfp_url} />
                    <div>
                        <h1 className="text-sm">
                            {actor.display_name ?? actor.username}
                        </h1>
                        <p className="text-xs">has followed you</p>
                    </div>
                    <div className="ml-auto text-xs">
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
        notification_type == "like_guide" ||
        notification_type == "like_comment_post" ||
        notification_type == "like_comment_guide"
    ) {
        const payload = notification.payload as LikePayloadType;
        const actor = payload.actor;
        content = (
            <>
                <div className="flex gap-3 cursor-pointer w-full mr-5 w-full mr-5">
                    <ProfilePicture src={actor.pfp_url} />
                    <div>
                        <h1 className="text-sm">
                            {actor.display_name ?? actor.username}
                        </h1>
                        <p className="text-xs">
                            has liked your{" "}
                            {notification_type === "like_guide"
                                ? "guide"
                                : notification_type === "like_post"
                                  ? "post"
                                  : "comment"}
                        </p>
                    </div>
                    <div className="ml-auto text-xs">
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
        notification_type == "diary" ||
        notification_type == "comment_post" ||
        notification_type == "comment_guide"
    ) {
        const payload = notification.payload as EntityPayloadType;
        const actor = payload.actor;
        content = (
            <>
                <div className="flex gap-3 cursor-pointer w-full mr-5 ">
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
                                  : notification_type === "diary"
                                    ? "added a new diary entry"
                                    : notification_type === "comment_post"
                                      ? "commented on your post"
                                      : "commented on your guide"}
                        </p>
                    </div>
                    <div className="ml-auto text-xs">
                        {dayjs(notification.created_at).format("h:mm A")}

                        <br />
                        <br />
                        {dayjs(notification.created_at).format("MMM D")}
                    </div>
                </div>
            </>
        );
    }

    return content;
}

export default NotifToast;
