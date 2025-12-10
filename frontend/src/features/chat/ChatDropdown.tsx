import ChatRoom from "@/features/chat/ChatRoom";
import chat_icon from "@/assets/icons/chat.svg";
import chat_notify from "@/assets/icons/chat_notify.svg";
import { useState } from "react";
import useChatState from "./hooks/useChatState";
import ChatList from "./ChatList";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useNotifyMessages from "./hooks/useNotifyMessages";

function ChatDropdown() {
    const [isListState, setIsListState] = useState(true);
    const { currentRoomObj, setCurrentRoomObj, dropdownOpen, setDropdownOpen } =
        useChatState(setIsListState);

    const { unreadCount, fetchUnreadCount } = useNotifyMessages({
        dropdownOpen: dropdownOpen,
    });

    function toggleListState() {
        setIsListState((prev) => !prev);
    }

    const icon =
        unreadCount === 0 ? (
            <div>
                <img
                    tabIndex={0}
                    role="button"
                    src={chat_icon}
                    alt="Chat"
                    className="w-6 h-6 sm:w-11 sm:h-11 cursor-pointer"
                />
            </div>
        ) : (
            <div className="relative">
                <img
                    src={chat_notify}
                    alt="unread chat"
                    className="w-6 h-6 sm:w-11 sm:h-11 cursor-pointer"
                />
                <p className="absolute top-0.5 right-[4.6px] text-xs text-base-100 font-bold ">
                    {unreadCount < 10 ? (
                        unreadCount
                    ) : (
                        <p className="text-[10px] absolute top-0.5 -right-[3px]">
                            9+
                        </p>
                    )}
                </p>
            </div>
        );

    return (
        <DropdownMenu
            open={dropdownOpen}
            onOpenChange={(open) => {
                setDropdownOpen(open);
                fetchUnreadCount();
            }}
        >
            <DropdownMenuTrigger>{icon}</DropdownMenuTrigger>
            <DropdownMenuContent className="border-none bg-base-100 absolute p-4 shadow-sm top-0 w-78 -right-35 h-[calc(100dvh-60px)] ">
                {isListState ? (
                    <ChatList
                        setCurrentRoomObj={setCurrentRoomObj}
                        toggleListState={toggleListState}
                    />
                ) : (
                    <ChatRoom
                        key={currentRoomObj.recipient?.id}
                        currentRoomObj={currentRoomObj}
                        toggleListState={toggleListState}
                    />
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ChatDropdown;
