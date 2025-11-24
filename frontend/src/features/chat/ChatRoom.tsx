import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import socket, { sendMessage } from "@/lib/socket";
import type { UserType } from "../auth/authTypes";
import ProfilePicture from "@/components/ProfilePicture";
import { ArrowLeft, SendIcon } from "lucide-react";
import useChat from "./useChat";
import ChatMessagesSection from "./ChatMessagesSection";
import type { ConversationRoomType, MessageSocketType } from "./chatTypes";

interface ChatRoomProps {
    recipientUser: UserType | null;
    conversationRoom: ConversationRoomType | null;
    toggleListState: () => void;
}

function ChatRoom({
    recipientUser,
    conversationRoom,
    toggleListState,
}: ChatRoomProps) {
    const { auth } = useAuthContext()!;
    const { messages, setMessages } = useChat(
        conversationRoom ? conversationRoom.uuid : null
    );
    const [message, setMessage] = useState<string>("");

    function onSendSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (auth.user && recipientUser) {
            sendMessage(
                auth.user,
                auth.user.username,
                recipientUser.username,
                message,
                conversationRoom ? conversationRoom.uuid : null
            );
            setMessage("");
        }
    }

    useEffect(() => {
        if (!conversationRoom) return;
        const listenRoom = `new_message_${conversationRoom.uuid}`;
        const handler = (data: MessageSocketType) => {
            const newMessage = {
                id: data.id,
                content: data.content,
                created_at: data.created_at,
                conversation_uuid: data.conversation_uuid,
                current_user_is_sender:
                    data.sender_username === auth.user?.username,
                sender: data.sender,
            };
            setMessages((prev) => [...(prev ?? []), newMessage]);
        };
        socket.on(listenRoom, handler);

        return () => {
            socket.off(listenRoom, handler);
        };
    }, [auth, setMessages, conversationRoom]);
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
                <div className=" bg-base-200 rounded-sm p-1 flex flex-col gap-5">
                    <div>
                        {!conversationRoom ? (
                            <h1 className="text-center mt-3">
                                spark a conversation
                            </h1>
                        ) : (
                            <ChatMessagesSection
                                room={conversationRoom}
                                messages={messages}
                            />
                        )}
                    </div>
                    <form
                        onSubmit={onSendSubmit}
                        className="flex gap-3 items-center px-2"
                    >
                        <input
                            type="text"
                            value={message}
                            className="input input-sm"
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <button className="opacity-80">
                            <SendIcon size={30} />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default ChatRoom;
