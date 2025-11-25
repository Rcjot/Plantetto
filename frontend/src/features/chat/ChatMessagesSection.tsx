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
    fetchMessages: () => Promise<void>;
    hasMore: boolean;
    loading: boolean;
}
function ChatMessagesSection({
    messages,
    room,
    fetchMessages,
    hasMore,
    loading,
}: ChatMessagesSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prevHeight = useRef(0);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const { auth } = useAuthContext()!;
    const [sessionLastReadMessageId, setSessionLastReadMessageId] = useState(
        room.last_read_message_id
    );
    const initialFetch = useRef(false);

    useEffect(() => {
        if (containerRef.current) {
            if (prevHeight.current != containerRef.current.scrollHeight) {
                containerRef.current.scrollTop =
                    containerRef.current.scrollHeight -
                    prevHeight.current +
                    100;
                // arbitrary number to adjust scroll

                prevHeight.current = containerRef.current.scrollHeight;
            }
        }
    });

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        bottomRef.current?.scrollIntoView({
            behavior: "instant",
            block: "nearest",
        });
    }, [messages]);

    useEffect(() => {
        if (!bottomRef.current || !topRef.current || messages.length === 0)
            return;
        const observedTopRef = topRef.current;
        const observedBotRef = bottomRef.current;
        const observer = new IntersectionObserver((entries) => {
            const MostRecentMessage = messages[0];

            entries.forEach((entry) => {
                if (entry.target === bottomRef.current) {
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
                }
                if (entry.target === topRef.current) {
                    if (
                        entry.isIntersecting &&
                        auth.user &&
                        hasMore &&
                        !loading &&
                        containerRef.current
                    ) {
                        // we keep track of current sessions last read id since room.last_read_message_id is not updated on message sent or receive.
                        fetchMessages();
                    }
                }
            });
        });

        observer.observe(bottomRef.current);
        observer.observe(topRef.current);

        return () => {
            if (observedBotRef) observer.unobserve(observedBotRef);
            if (observedTopRef) observer.unobserve(observedTopRef);
            observer.disconnect();
        };
    }, [
        messages,
        auth,
        room,
        sessionLastReadMessageId,
        fetchMessages,
        hasMore,
        loading,
    ]);

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
        <div
            ref={containerRef}
            className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100dvh-350px)] px-2"
        >
            {hasMore ? (
                <div ref={topRef} className="">
                    <div className="flex w-full flex-col gap-4 max-w-[580px]">
                        <div className="flex items-center gap-4 w-full">
                            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4 w-full">
                                <div className="skeleton h-4 w-full"></div>
                                <div className="skeleton h-4 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="self-center text-center">
                    wishing <br /> for a fruitful <br /> conversation
                </div>
            )}
            {rendered}
            <div className="min-w-10 min-h-5 bg-none" ref={bottomRef} />
        </div>
    );
}

export default ChatMessagesSection;
