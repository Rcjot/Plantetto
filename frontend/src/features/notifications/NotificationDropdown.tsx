import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationList from "./NotificationList";
import useNotification from "./hooks/useNotification";
import { Bell } from "lucide-react";

function NotificationDropdown() {
    const {
        notifs,
        markAllRead,
        markNotificationRead,
        dropdownOpen,
        setDropdownOpen,
    } = useNotification();

    const notificationIcon = (unread: boolean) => {
        if (unread) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                    <path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665" />
                    <circle
                        cx="18"
                        cy="8"
                        r="3"
                        className="text-accent fill-accent"
                    />
                </svg>
            );
        } else {
            return <Bell size={28} />;
        }
    };

    if (!notifs) return <div> loading ..</div>;
    const unread = notifs.length > 0;

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className="cursor-pointer">
                    {notificationIcon(unread)}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none bg-base-100 absolute p-4 shadow-xl top-0 w-78 -right-24 h-[calc(100dvh-60px)]">
                    <NotificationList
                        notifications={notifs}
                        markNotificationRead={markNotificationRead}
                    >
                        <h1 className="text-xl font-[600]">Notifications</h1>
                        <button
                            className="cursor-pointer"
                            onClick={markAllRead}
                        >
                            <h1 className="text-xs underline">
                                mark all as read
                            </h1>
                        </button>
                    </NotificationList>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default NotificationDropdown;
