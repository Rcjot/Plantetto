import { useAuthContext } from "@/features/auth/AuthContext";
import type { ConversationRoomType, MessageSocketType } from "../chatTypes";
import ProfilePicture from "@/components/ProfilePicture";
import type { UserType } from "@/features/auth/authTypes";
import socket from "@/lib/socket";
import { useEffect, useState } from "react";

interface ChatListBlockType {
    room: ConversationRoomType;
    setCurrentRecipient: React.Dispatch<React.SetStateAction<UserType | null>>;
    toggleListState: () => void;
}

function ChatListBlock({
    room,
    setCurrentRecipient,
    toggleListState,
}: ChatListBlockType) {
    const [recentMessage, setRecentMessage] = useState("");
    const { auth } = useAuthContext()!;

    useEffect(() => {
        const listenRoom = `new_message_${room.uuid}`;
        const handler = (data: MessageSocketType) => {
            const current_user_is_sender =
                data.sender_username === auth.user?.username;
            const content = current_user_is_sender
                ? "you: " + data.content
                : data.content;
            setRecentMessage(content);
        };

        socket.on(listenRoom, handler);

        return () => {
            socket.off(listenRoom, handler);
        };
    }, [room, auth]);

    useEffect(() => {
        if (!room.recent_message) return;
        const content = room.recent_message.current_user_is_sender
            ? "you: " + room.recent_message.content
            : room.recent_message.content;
        setRecentMessage(content);
    }, [room]);

    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                setCurrentRecipient(room.recipient);

                // because it takes time to setup new room (rerender)
                setTimeout(() => toggleListState(), 150);
            }}
            tabIndex={-1}
            key={room.uuid}
            className="flex gap-2 cursor-pointer"
        >
            <ProfilePicture src={room.recipient.pfp_url} />
            <div className="flex flex-col">
                <h1>
                    {room.recipient.display_name ?? room.recipient.username}
                </h1>
                <p className="text-gray-600">{recentMessage}</p>
            </div>
        </div>
    );
}

export default ChatListBlock;
