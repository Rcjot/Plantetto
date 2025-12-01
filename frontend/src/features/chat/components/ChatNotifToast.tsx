import ProfilePicture from "@/components/ProfilePicture";
import type { MessageType } from "../chatTypes";
import dayjs from "dayjs";

function ChatNotifToast({ message }: { message: MessageType }) {
    const sender = message.sender;
    return (
        <>
            <div
                className="w-full mr-5 flex gap-3 cursor-pointer justify-"
                onClick={() => {
                    const event = new CustomEvent("openChat", {
                        detail: { user: message.sender },
                    });
                    window.dispatchEvent(event);
                }}
            >
                <ProfilePicture src={sender.pfp_url} />
                <div>
                    <h1 className="text-sm">
                        {sender.display_name ?? sender.username}
                    </h1>
                    <p className="text-xs wrap-anywhere max-w-27">
                        {message.content.length > 30
                            ? message.content.slice(0, 30) + "..."
                            : message.content}
                    </p>
                </div>
                <div className="ml-auto text-xs">
                    {dayjs(message.created_at).format("h:mm A")}

                    <br />
                    <br />
                    {dayjs(message.created_at).format("MMM D")}
                </div>
            </div>
        </>
    );
}

export default ChatNotifToast;
