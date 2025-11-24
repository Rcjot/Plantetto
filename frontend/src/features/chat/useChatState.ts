import { useRef, useEffect, useState } from "react";
import chatApi from "@/api/chatApi";
import type { UserType } from "../auth/authTypes";
import socket from "@/lib/socket";
import type { ConversationRoomType } from "./chatTypes";

function useChatState(
    setIsListState: React.Dispatch<React.SetStateAction<boolean>>
) {
    const buttonRef = useRef<HTMLImageElement>(null);

    const [currentRecipient, setCurrentRecipient] = useState<UserType | null>(
        null
    );
    const [conversationRoom, setConversationRoom] =
        useState<ConversationRoomType | null>(null);
    // conversationRoom will base on currentRecipient

    useEffect(() => {
        // useEffect for listening to openChat event
        // openChat event happens when chat button from profile page is clicked
        const handler = (event: CustomEvent<{ user: UserType }>) => {
            buttonRef.current?.focus();
            setCurrentRecipient(event.detail.user);

            setIsListState(false);
        };
        window.addEventListener("openChat", handler as EventListener);

        return () =>
            window.removeEventListener("openChat", handler as EventListener);
    }, [setIsListState]);

    useEffect(() => {
        const handler = async (newConversationUuid: string) => {
            console.log("create convo", newConversationUuid);
            const { conversationRoom } =
                await chatApi.getConversationByUuid(newConversationUuid);
            setConversationRoom(conversationRoom);
        };

        socket.on("conversation_created", handler);
        return () => {
            socket.off("conversation_created", handler);
        };
    });

    useEffect(() => {
        const fetchConversationRoom = async () => {
            if (currentRecipient) {
                const { conversationRoom: conversationRoomRes } =
                    await chatApi.getConversationRoom(
                        currentRecipient.username
                    );
                console.log("fetching conversation", conversationRoomRes);
                setConversationRoom(conversationRoomRes);
            }
        };
        fetchConversationRoom();
    }, [currentRecipient]);

    return {
        buttonRef,
        currentRecipient,
        setCurrentRecipient,
        conversationRoom,
    };
}

export default useChatState;
