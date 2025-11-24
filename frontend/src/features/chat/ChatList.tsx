import type { UserType } from "../auth/authTypes";
import type { ConversationRoomType } from "./chatTypes";
import ChatListBlock from "./components/ChatListBlock";

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
                        <ChatListBlock
                            room={room}
                            setCurrentRecipient={setCurrentRecipient}
                            toggleListState={toggleListState}
                            key={room.uuid}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default ChatList;
