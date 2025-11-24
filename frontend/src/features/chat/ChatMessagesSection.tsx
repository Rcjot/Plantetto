import { useEffect, useRef } from "react";
import type { MessageType } from "./chatTypes";
import ChatBubbleRecipient from "./components/ChatBubbleRecipient";
import ChatBubbleSender from "./components/ChatBubbleSender";
import dayjs from "dayjs";

interface ChatMessagesSectionProps {
    messages: MessageType[];
}
function ChatMessagesSection({ messages }: ChatMessagesSectionProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "instant",
            block: "nearest",
        });
    }, [messages]);

    let oldDateDay = 0;

    return (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100dvh-350px)] px-2">
            {messages.map((message) => {
                const localDateDay = dayjs(message.created_at).get("date");
                const isSameDay = oldDateDay === localDateDay;
                oldDateDay = localDateDay;

                return (
                    <div key={message.created_at}>
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
            <div ref={bottomRef} />
        </div>
    );
}

export default ChatMessagesSection;
