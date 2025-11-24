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
    const [recentMessage, setRecentMessage] = useState("some initial");

    useEffect(() => {
        const handler = (data: MessageSocketType) => {
            setRecentMessage(data.content);
        };
        socket.on(room.uuid, handler);

        return () => {
            socket.off(room.uuid, handler);
        };
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
