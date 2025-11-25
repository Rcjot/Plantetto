import type { ConversationRoomType } from "../chatTypes";
import ProfilePicture from "@/components/ProfilePicture";
import type { UserType } from "@/features/auth/authTypes";
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

    const unreadState = room.last_read_message_id < room.recent_message.id;

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
                <div className="flex items-center gap-3 ">
                    {unreadState && (
                        <div className="rounded-full h-3 w-3 bg-secondary opacity-30" />
                    )}
                    <p
                        className={`text-gray-600 truncate max-w-40 ${unreadState && "font-[650]"}`}
                    >
                        {recentMessage}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ChatListBlock;
