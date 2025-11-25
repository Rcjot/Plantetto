import React, { useEffect, useRef, useState } from "react";
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
    const [sessionLastReadMessageId, setSessionLastReadMessageId] = useState(
        room.last_read_message_id
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages]);

    useEffect(() => {
        if (!bottomRef.current || messages.length === 0) return;
        const observedRef = bottomRef.current;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            const MostRecentMessage = messages[0];

            if (entry.isIntersecting && auth.user) {
                // we keep track of current sessions last read id since room.last_read_message_id is not updated on message sent or receive.
                if (sessionLastReadMessageId === MostRecentMessage.id) {
                    return;
                }
                setSessionLastReadMessageId(MostRecentMessage.id);

                readMessage(
                    auth.user,
                    auth.user?.username,
                    MostRecentMessage.id,
                    MostRecentMessage.conversation_uuid
                );
            }
        });

        observer.observe(bottomRef.current);

        return () => {
            if (observedRef) observer.unobserve(observedRef);
            observer.disconnect();
        };
    }, [messages, auth, room, sessionLastReadMessageId]);

    let oldDateDay = 0;

    const rendered: React.ReactNode[] = [];

    // messages are fetched in descending order, most recent first
    // iterate from the end to render oldest first
    function renderMessages() {
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const localDateDay = dayjs(message.created_at).get("date");
            const isSameDay = oldDateDay === localDateDay;
            oldDateDay = localDateDay;

            rendered.push(
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
        }
    }
    renderMessages();

    return (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100dvh-350px)] px-2">
            {rendered}
            <div className="min-w-10 min-h-5 bg-none" ref={bottomRef} />
        </div>
    );
}

export default ChatMessagesSection;
