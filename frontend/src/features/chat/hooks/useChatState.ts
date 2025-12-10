import { useEffect, useState } from "react";
import type { UserType } from "../../auth/authTypes";
import socket from "@/lib/socket";
import chatApi from "@/api/chatApi";
import type { ConversationRoomType } from "../chatTypes";
export interface RoomObjType {
    recipient: UserType | null;
    room: ConversationRoomType | null | string;
}
function useChatState(
    setIsListState: React.Dispatch<React.SetStateAction<boolean>>
) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [currentRoomObj, setCurrentRoomObj] = useState<RoomObjType>({
        recipient: null,
        room: "",
        // loading initial state
    });
    // conversationRoom will base on currentRecipient

    useEffect(() => {
        // useEffect for listening to openChat event
        // openChat event happens when chat button from profile page is clicked

        const handleAsync = async (user: UserType) => {
            const { conversationRoom: conversationRoomRes } =
                await chatApi.getConversationRoom(user.username);

            setCurrentRoomObj({
                recipient: user,
                room: conversationRoomRes,
            });
            setIsListState(false);
        };

        const handler = (event: CustomEvent<{ user: UserType }>) => {
            setDropdownOpen(true);
            console.log("hey", event.detail.user);
            handleAsync(event.detail.user);
        };
        window.addEventListener("openChat", handler as EventListener);

        return () =>
            window.removeEventListener("openChat", handler as EventListener);
    }, [setIsListState]);

    useEffect(() => {
        const handleAsync = async (newConversationUuid: string) => {
            console.log("create convo", newConversationUuid);

            const { conversationRoom } =
                await chatApi.getConversationByUuid(newConversationUuid);

            setCurrentRoomObj((prev) => ({
                ...prev,
                room: conversationRoom,
            }));
        };

        const handler = async (newConversationUuid: string) => {
            handleAsync(newConversationUuid);
        };

        socket.on("conversation_created", handler);
        return () => {
            socket.off("conversation_created", handler);
        };
    });

    return {
        currentRoomObj,
        setCurrentRoomObj,
        dropdownOpen,
        setDropdownOpen,
    };
}

export default useChatState;
