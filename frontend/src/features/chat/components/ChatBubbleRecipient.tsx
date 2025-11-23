import dayjs from "dayjs";
import type { MessageType } from "../chatTypes";

function ChatBubbleRecipient({ message }: { message: MessageType }) {
    return (
        <>
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src={message.sender.pfp_url}
                        />
                    </div>
                </div>
                <div className="chat-header">
                    {message.sender.display_name ?? message.sender.username}
                    <time className="text-xs opacity-50">
                        {dayjs(message.created_at).format("h:mm A")}
                    </time>
                </div>
                <div className="chat-bubble">{message.content}</div>
                {/* <div className="chat-footer opacity-50">Delivered</div> */}
            </div>
        </>
    );
}

export default ChatBubbleRecipient;
