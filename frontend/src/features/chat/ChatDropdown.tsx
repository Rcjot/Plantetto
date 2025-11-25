import ChatRoom from "@/features/chat/ChatRoom";
import chat_icon from "@/assets/icons/chat.svg";
import { useState, useRef } from "react";
import useChatState from "./hooks/useChatState";
import ChatList from "./ChatList";

function ChatDropdown() {
    const [isListState, setIsListState] = useState(true);
    const {
        buttonRef,
        currentRecipient,
        conversationRoom,
        setCurrentRecipient,
    } = useChatState(setIsListState);

    const ulDropdownRef = useRef<HTMLUListElement>(null);

    function toggleListState() {
        // buttons inside dynamically rendered components dismounts and redirects focus somewhere else not the dropdown
        // fix by programmatically regain focus for the dropdown
        ulDropdownRef.current?.focus();
        setIsListState((prev) => !prev);
    }

    return (
        <>
            <img
                tabIndex={0}
                role="button"
                src={chat_icon}
                alt="Chat"
                className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
                ref={buttonRef}
            />

            <ul
                tabIndex={-1}
                ref={ulDropdownRef}
                className="right-11 dropdown-content p-4 menu bg-base-100 rounded-box z-1 w-52 shadow-sm w-[300px] h-[calc(100dvh-60px)]"
            >
                {isListState ? (
                    <ChatList
                        setCurrentRecipient={setCurrentRecipient}
                        toggleListState={toggleListState}
                    />
                ) : (
                    <ChatRoom
                        recipientUser={currentRecipient}
                        conversationRoom={conversationRoom}
                        toggleListState={toggleListState}
                    />
                )}
            </ul>
        </>
    );
}

export default ChatDropdown;
