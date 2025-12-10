import type { NotificationType } from "./notificationTypes";
import NotificationBlock from "./components/NotificationBlock";

interface NotificationListProps {
    notifications: NotificationType[];
    children: React.ReactNode;
    markNotificationRead: (notifId: number) => Promise<void>;
    hasMore: boolean;
    loading: boolean;
    fetchNotifications: (isReset: boolean) => void;
}

function NotificationList({
    notifications,
    children,
    markNotificationRead,
    hasMore,
    loading,
    fetchNotifications,
}: NotificationListProps) {
    return (
        <>
            <div className="flex flex-1 flex-col gap-5">
                <div className="flex justify-between items-center">
                    {children}
                </div>
                {notifications.length === 0 && (
                    <p className="text-center">you're fully caught up! :)</p>
                )}
                <div className="flex flex-col gap-5 max-h-[calc(100dvh-150px)] p-1 overflow-auto">
                    {notifications.map((notification) => {
                        return (
                            <NotificationBlock
                                key={notification.id}
                                notification={notification}
                                markNotificationRead={markNotificationRead}
                            />
                        );
                    })}
                    {hasMore && !loading && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                fetchNotifications(false);
                            }}
                        >
                            load more..
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default NotificationList;
