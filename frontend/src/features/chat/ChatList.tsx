import type { UserType } from "../auth/authTypes";
import ChatListBlock from "./components/ChatListBlock";
import useConversationRooms from "./hooks/useConversationRooms";
import { Search } from "lucide-react";

interface ChatListProps {
    setCurrentRecipient: React.Dispatch<React.SetStateAction<UserType | null>>;
    toggleListState: () => void;
}

function ChatList({ setCurrentRecipient, toggleListState }: ChatListProps) {
    const {
        conversationRooms: conversationRoomsList,
        search,
        setSearch,
        onSubmit,
    } = useConversationRooms();

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-xl font-[600]">Chats</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(true);
                }}
                className="flex gap-2"
            >
                <Search size={20} />
                <input
                    type="text"
                    className="input input-xs w-3/4"
                    placeholder="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary btn-xs">search</button>
            </form>

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
