import { useEffect, useRef } from "react";
import type { ConversationRoomType, MessageType } from "./chatTypes";
import ChatBubbleRecipient from "./components/ChatBubbleRecipient";
import ChatBubbleSender from "./components/ChatBubbleSender";
import dayjs from "dayjs";
import { readMessage } from "@/lib/socket";
import { useAuthContext } from "../auth/AuthContext";

interface ChatMessagesSectionProps {
    messages: MessageType[];
    room: ConversationRoomType;
}
function ChatMessagesSection({ messages, room }: ChatMessagesSectionProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { auth } = useAuthContext()!;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages]);

    useEffect(() => {
        if (!bottomRef.current) return;
        const observedRef = bottomRef.current;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            const lastMessage = messages[messages.length - 1];

            if (entry.isIntersecting && auth.user) {
                if (room.last_read_message_id === lastMessage.id) {
                    return;
                }
                readMessage(
                    auth.user,
                    auth.user?.username,
                    lastMessage.id,
                    lastMessage.conversation_uuid
                );
            }
        });

        observer.observe(bottomRef.current);

        return () => {
            if (observedRef) observer.unobserve(observedRef);
            observer.disconnect();
        };
    }, [messages, auth, room]);

    let oldDateDay = 0;

    return (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100dvh-350px)] px-2">
            {messages.map((message) => {
                const localDateDay = dayjs(message.created_at).get("date");
                const isSameDay = oldDateDay === localDateDay;
                oldDateDay = localDateDay;
                return (
                    <div key={message.id}>
                        {!isSameDay && (
                            <div className="flex justify-center items-center my-4">
                                <div className="flex-1 mr-4 border-t border-neutral opacity-50" />
                                <p className="text-xs opacity-50">
                                    {dayjs(message.created_at).format("MMM D")}
                                </p>
                                <div className="flex-1 ml-4 border-t  border-neutral opacity-50" />
                            </div>
                        )}
                        <div>
                            {message.current_user_is_sender ? (
                                <ChatBubbleSender message={message} />
                            ) : (
                                <ChatBubbleRecipient message={message} />
                            )}
                        </div>
                    </div>
                );
            })}
            <div className="min-w-10 min-h-5 bg-none" ref={bottomRef} />
        </div>
    );
}

export default ChatMessagesSection;
