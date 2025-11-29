import type { NotificationType } from "./notificationTypes";
import NotificationBlock from "./components/NotificationBlock";

interface NotificationListProps {
    notifications: NotificationType[];
}

function NotificationList({ notifications }: NotificationListProps) {
    return (
        <>
            <div className="flex flex-1 flex-col gap-5 ">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-[600]">Notifications</h1>
                    <button className="cursor-pointer">
                        <h1 className="text-xs underline">mark all as read</h1>
                    </button>
                </div>
                {notifications.map((notification) => {
                    return (
                        <NotificationBlock
                            key={notification.id}
                            notification={notification}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default NotificationList;
