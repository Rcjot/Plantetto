import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import notification_icon from "@/assets/icons/notification.svg";
import NotificationList from "./NotificationList";
import useNotification from "./hooks/useNotification";

function NotificationDropdown() {
    const { notifs } = useNotification();
    console.log(notifs);
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <img
                        src={notification_icon}
                        alt="Notifications"
                        className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
                    />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none bg-base-100 absolute p-4 shadow-xl top-0 w-78 -right-24 h-[calc(100dvh-60px)]">
                    <NotificationList />
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default NotificationDropdown;
