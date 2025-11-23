import type { UserType } from "../auth/authTypes";
import type { ConversationRoomType } from "./chatTypes";
import ProfilePicture from "@/components/ProfilePicture";
interface ChatListProps {
    conversationRoomsList: ConversationRoomType[];
    setCurrentRecipient: React.Dispatch<React.SetStateAction<UserType | null>>;
    toggleListState: () => void;
}

function ChatList({
    conversationRoomsList,
    setCurrentRecipient,
    toggleListState,
}: ChatListProps) {
    return (
        <div className="flex flex-col gap-10">
            <h1 className="text-xl font-[600]">Chats</h1>
            <div className="flex flex-col gap-3">
                {conversationRoomsList.map((room) => {
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
                                    {room.recipient.display_name ??
                                        room.recipient.username}
                                </h1>
                                <p className="text-gray-600">
                                    some recent chat
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ChatList;
