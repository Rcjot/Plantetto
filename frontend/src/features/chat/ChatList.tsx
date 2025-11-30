import { useEffect, useRef } from "react";
import ChatListBlock from "./components/ChatListBlock";
import useConversationRooms from "./hooks/useConversationRooms";
import { Search } from "lucide-react";
import type { RoomObjType } from "./hooks/useChatState";

interface ChatListProps {
    setCurrentRoomObj: React.Dispatch<React.SetStateAction<RoomObjType>>;
    toggleListState: () => void;
}

function ChatList({ toggleListState, setCurrentRoomObj }: ChatListProps) {
    const {
        conversationRooms: conversationRoomsList,
        search,
        hasMore,
        setSearch,
        loading,
        refetchWithResetCursorIs,
        isAllState,
        toggleIsAllState,
    } = useConversationRooms();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bottomRef.current) return;
        const observedBotRef = bottomRef.current;
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && hasMore && !loading) {
                refetchWithResetCursorIs(false);
            }
        });

        observer.observe(bottomRef.current);

        return () => {
            if (observedBotRef) observer.unobserve(observedBotRef);
            observer.disconnect();
        };
    }, [refetchWithResetCursorIs, hasMore, loading]);

    return (
        <div className="flex flex-1 flex-col gap-5 ">
            <h1 className="text-xl font-[600]">Chats</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    refetchWithResetCursorIs(true);
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
            <div className="flex gap-2 h-8 ">
                <button
                    className={`btn btn-success flex-1 h-full  ${isAllState && "bg-success/30"}`}
                    onClick={() => toggleIsAllState(true)}
                >
                    All
                </button>
                <button
                    className={`btn btn-success flex-1 h-full  ${!isAllState && "bg-success/30"}`}
                    onClick={() => toggleIsAllState(false)}
                >
                    Unread
                </button>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto  max-h-[calc(100dvh-300px)]  ">
                {conversationRoomsList.map((room) => {
                    return (
                        <ChatListBlock
                            room={room}
                            setCurrentRoomObj={setCurrentRoomObj}
                            toggleListState={toggleListState}
                            key={room.uuid}
                        />
                    );
                })}
                {hasMore && (
                    <div className="flex w-full flex-col gap-4 max-w-[580px]">
                        <div className="flex items-center gap-4 w-full">
                            <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4 w-full">
                                <div className="skeleton h-4 w-full"></div>
                                <div className="skeleton h-4 w-full"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="min-w-10 min-h-5 bg-none" ref={bottomRef} />
            </div>
        </div>
    );
}

export default ChatList;
