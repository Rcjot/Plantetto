import ChatRoom from "@/features/chat/ChatRoom";
import chat_icon from "@/assets/icons/chat.svg";
import { useState } from "react";
import useChatState from "./hooks/useChatState";
import ChatList from "./ChatList";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ChatDropdown() {
    const [isListState, setIsListState] = useState(true);
    const { currentRoomObj, setCurrentRoomObj, dropdownOpen, setDropdownOpen } =
        useChatState(setIsListState);

    function toggleListState() {
        setIsListState((prev) => !prev);
    }

    return (
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger>
                <img
                    tabIndex={0}
                    role="button"
                    src={chat_icon}
                    alt="Chat"
                    className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
                />
            </DropdownMenuTrigger>
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
