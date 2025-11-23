import { useEffect, useState } from "react";
import type { MessageType } from "./chatTypes";
import chatApi from "@/api/chatApi";

function useChat(conversationRoomUuid: string | null) {
    const [messages, setMessages] = useState<MessageType[] | null>(null);

    useEffect(() => {
        if (conversationRoomUuid) {
            const fetchMessages = async () => {
                const { messages: messagesRes } =
                    await chatApi.getConversationMessages(conversationRoomUuid);
                setMessages(messagesRes);
            };
            fetchMessages();
        }
    }, [conversationRoomUuid]);

    return { messages, setMessages };
}

export default useChat;
