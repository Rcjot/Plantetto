import { useEffect, useState } from "react";
import type { UserType } from "../../auth/authTypes";
import socket from "@/lib/socket";
import chatApi from "@/api/chatApi";
import type { ConversationRoomType } from "../chatTypes";
import type { MarketItemType } from "@/features/market/marketTypes";
export interface RoomObjType {
    recipient: UserType | null;
    room: ConversationRoomType | null | string;
    defaultMessage: string;
}
function useChatState(
    setIsListState: React.Dispatch<React.SetStateAction<boolean>>
) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [currentRoomObj, setCurrentRoomObj] = useState<RoomObjType>({
        recipient: null,
        room: "",
        defaultMessage: "",
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
                defaultMessage: "",
            });
            setIsListState(false);
        };

        const handler = (event: CustomEvent<{ user: UserType }>) => {
            setDropdownOpen(true);
            handleAsync(event.detail.user);
        };
        window.addEventListener("openChat", handler as EventListener);

        return () =>
            window.removeEventListener("openChat", handler as EventListener);
    }, [setIsListState]);

    useEffect(() => {
        // useEffect for listening to openChat event but from market item

        const handleAsync = async (
            user: UserType,
            marketItem: MarketItemType
        ) => {
            const { conversationRoom: conversationRoomRes } =
                await chatApi.getConversationRoom(user.username);

            const message = `Hi! Is this ${marketItem.plant.nickname} still available?`;

            setCurrentRoomObj({
                recipient: user,
                room: conversationRoomRes,
                defaultMessage: message,
            });
            setIsListState(false);
        };

        const handler = (
            event: CustomEvent<{ user: UserType; item: MarketItemType }>
        ) => {
            setDropdownOpen(true);
            handleAsync(event.detail.user, event.detail.item);
        };
        window.addEventListener("openChatMarket", handler as EventListener);

        return () =>
            window.removeEventListener(
                "openChatMarket",
                handler as EventListener
            );
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
