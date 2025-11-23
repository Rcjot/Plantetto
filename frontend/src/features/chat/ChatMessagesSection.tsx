import type { MessageType } from "./chatTypes";
import ChatBubbleRecipient from "./components/ChatBubbleRecipient";
import ChatBubbleSender from "./components/ChatBubbleSender";

interface ChatMessagesSectionProps {
    messages: MessageType[];
}
function ChatMessagesSection({ messages }: ChatMessagesSectionProps) {
    return (
        <div className="flex flex-col gap-3">
            {messages.map((message) => {
                return (
                    <>
                        {message.current_user_is_sender ? (
                            <ChatBubbleSender
                                key={message.created_at}
                                message={message}
                            />
                        ) : (
                            <ChatBubbleRecipient
                                key={message.created_at}
                                message={message}
                            />
                        )}
                    </>
                );
            })}
        </div>
    );
}

export default ChatMessagesSection;
