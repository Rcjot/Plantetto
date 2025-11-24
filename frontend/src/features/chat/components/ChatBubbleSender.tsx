import type { MessageType } from "../chatTypes";
import dayjs from "dayjs";

function ChatBubbleSender({ message }: { message: MessageType }) {
    return (
        <>
            <div
                className="chat chat-end"
                title={dayjs(message.created_at).format("MMM D")}
            >
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
                <div className="chat-bubble wrap-anywhere">
                    {message.content}
                </div>
                {/* <div className="chat-footer opacity-50">Seen at 12:46</div> */}
            </div>
        </>
    );
}

export default ChatBubbleSender;
