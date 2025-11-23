import { useEffect, useRef } from "react";
import type { MessageType } from "./chatTypes";
import ChatBubbleRecipient from "./components/ChatBubbleRecipient";
import ChatBubbleSender from "./components/ChatBubbleSender";

interface ChatMessagesSectionProps {
    messages: MessageType[];
}
function ChatMessagesSection({ messages }: ChatMessagesSectionProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages]);

    return (
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100dvh-350px)] px-2">
            {messages.map((message) => {
                return (
                    <div key={message.created_at}>
                        {message.current_user_is_sender ? (
                            <ChatBubbleSender message={message} />
                        ) : (
                            <ChatBubbleRecipient message={message} />
                        )}
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}

export default ChatMessagesSection;
