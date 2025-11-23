import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import socket, { sendMessage } from "@/lib/socket";
import type { UserType } from "../auth/authTypes";
import ProfilePicture from "@/components/ProfilePicture";
import { ArrowLeft } from "lucide-react";
import useChat from "./useChat";
import ChatMessagesSection from "./ChatMessagesSection";
import type { MessageSocketType } from "./chatTypes";

interface ChatRoomProps {
    recipientUser: UserType | null;
    conversationRoom: string | null;
    toggleListState: () => void;
}

function ChatRoom({
    recipientUser,
    conversationRoom,
    toggleListState,
}: ChatRoomProps) {
    const { auth } = useAuthContext()!;
    const { messages, setMessages } = useChat(conversationRoom);
    const [message, setMessage] = useState<string>("");

    function onSendSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (auth.user && recipientUser) {
            sendMessage(
                auth.user,
                auth.user.username,
                recipientUser.username,
                message,
                conversationRoom
            );
            setMessage("");
        }
    }

    useEffect(() => {
        console.log("listening to new messages");
        const handler = (data: MessageSocketType) => {
            console.log("handle response", data);

            const newMessage = {
                content: data.content,
                created_at: data.created_at,
                current_user_is_sender:
                    data.sender_username === auth.user?.username,
                sender: data.sender,
            };
            setMessages((prev) => [...(prev ?? []), newMessage]);
        };
        socket.on("new_message", handler);

        return () => {
            socket.off("new_message", handler);
        };
    }, [auth, setMessages]);
    // initially this is not mounted yet, so chatroom has to be opened to receive messages
    // transfer this when working in notifications.
    if (!recipientUser || !messages) return <div>loading...</div>;

    return (
        <>
            <div className="flex flex-col gap-5">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleListState();
                    }}
                    className="self-start cursor-pointer"
                >
                    <ArrowLeft size={25} />
                </button>
                <div className="flex items-center gap-3 font-[700] text-lg  ">
                    <ProfilePicture src={recipientUser.pfp_url} />
                    <h1>
                        {recipientUser.display_name ?? recipientUser.username}
                    </h1>
                </div>
                <div>
                    messages history here
                    {!conversationRoom ? (
                        <h1>spark a conversation</h1>
                    ) : (
                        <ChatMessagesSection messages={messages} />
                    )}
                </div>
                <form onSubmit={onSendSubmit}>
                    <div>
                        <label>message</label>
                        <input
                            type="text"
                            value={message}
                            className="input"
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary">send</button>
                </form>
            </div>
        </>
    );
}
export default ChatRoom;
