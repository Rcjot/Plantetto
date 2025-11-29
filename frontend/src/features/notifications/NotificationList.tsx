import type { NotificationType } from "./notificationTypes";
import NotificationBlock from "./components/NotificationBlock";

interface NotificationListProps {
    notifications: NotificationType[];
    children: React.ReactNode;
    markNotificationRead: (notifId: number) => Promise<void>;
}

function NotificationList({
    notifications,
    children,
    markNotificationRead,
}: NotificationListProps) {
    return (
        <>
            <div className="flex flex-1 flex-col gap-5 ">
                <div className="flex justify-between items-center">
                    {children}
                </div>
                {notifications.map((notification) => {
                    return (
                        <NotificationBlock
                            key={notification.id}
                            notification={notification}
                            markNotificationRead={markNotificationRead}
                        />
                    );
                })}
            </div>
        </>
    );
}

export default NotificationList;
