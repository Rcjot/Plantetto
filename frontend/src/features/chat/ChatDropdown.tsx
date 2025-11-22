import ChatRoom from "@/features/chat/ChatRoom";
import chat_icon from "@/assets/icons/chat.svg";
import { useRef, useEffect, useState } from "react";
import chatApi from "@/api/chatApi";
import type { UserType } from "../auth/authTypes";

function ChatDropdown() {
    const buttonRef = useRef<HTMLImageElement>(null);
    const [currentRecipient, setCurrentRecipient] = useState<UserType | null>(
        null
    );
    const [conversationRoom, setConversationRoom] = useState<string | null>(
        null
    );

    useEffect(() => {
        const handler = (event: CustomEvent<{ user: UserType }>) => {
            buttonRef.current?.focus();
            console.log(event.detail.user);
            setCurrentRecipient(event.detail.user);
        };
        window.addEventListener("openChat", handler as EventListener);

        return () =>
            window.removeEventListener("openChat", handler as EventListener);
    }, []);

    useEffect(() => {
        const fetchConversationRoom = async () => {
            if (currentRecipient) {
                const { conversationRoom: conversationRoomRes } =
                    await chatApi.getConversationRoom(
                        currentRecipient.username
                    );
                setConversationRoom(conversationRoomRes);
            }
        };
        fetchConversationRoom();
    }, [currentRecipient]);

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

            <div
                tabIndex={-1}
                className="right-11 dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-[300px] h-[calc(100dvh-60px)]"
            >
                <ChatRoom
                    recipientUser={currentRecipient}
                    conversationRoom={conversationRoom}
                />
            </div>
        </>
    );
}

export default ChatDropdown;
