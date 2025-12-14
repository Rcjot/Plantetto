import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import socket, { sendMessage } from "@/lib/socket";
import ProfilePicture from "@/components/ProfilePicture";
import { ArrowLeft, SendIcon } from "lucide-react";
import useChat from "./hooks/useChat";
import ChatMessagesSection from "./ChatMessagesSection";
import type { MessageSocketType } from "./chatTypes";
import type { RoomObjType } from "./hooks/useChatState";

interface ChatRoomProps {
    toggleListState: () => void;
    currentRoomObj: RoomObjType;
    defaultMessage: string;
    setDefaultMessage: React.Dispatch<React.SetStateAction<string>>;
}

function ChatRoom({
    toggleListState,
    currentRoomObj,
    defaultMessage,
    setDefaultMessage,
}: ChatRoomProps) {
    const { auth } = useAuthContext()!;
    const currentRoomObjUuid =
        currentRoomObj.room && typeof currentRoomObj.room !== "string"
            ? currentRoomObj.room.uuid
            : null;
    const { messagesObj, appendMessage, fetchMessages, hasMore, loading } =
        useChat(currentRoomObjUuid);
    const [message, setMessage] = useState<string>(
        currentRoomObj.defaultMessage ? defaultMessage : ""
    );
    // no idea why i decided it to be like this
    // i guess to not invoke setCurrentRoomObj just to update defaultmessage?
    // idk..

    function onSendSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (auth.user && currentRoomObj.recipient) {
            sendMessage(
                auth.user,
                auth.user.username,
                currentRoomObj.recipient.username,
                message,
                currentRoomObjUuid
            );
            setMessage("");
            setDefaultMessage("");
        }
    }

    useEffect(() => {
        setMessage(currentRoomObj.defaultMessage ? defaultMessage : "");
    }, [defaultMessage, currentRoomObj]);

    useEffect(() => {
        if (!currentRoomObjUuid) return;
        const listenRoom = `new_message_${currentRoomObjUuid}`;
        const handler = (data: MessageSocketType) => {
            const newMessage = {
                id: data.id,
                content: data.content,
                created_at: data.created_at,
                conversation_uuid: data.conversation_uuid,
                current_user_is_sender:
                    data.sender_username === auth.user?.username,
                sender: data.sender,
            };
            appendMessage(newMessage);
            // messages are fetched in descending order
        };
        socket.on(listenRoom, handler);

        return () => {
            socket.off(listenRoom, handler);
        };
    }, [auth, appendMessage, currentRoomObjUuid]);
    // initially this is not mounted yet, so chatroom has to be opened to receive messages
    // transfer this when working in notifications.

    if (
        !currentRoomObj.recipient ||
        !messagesObj ||
        typeof currentRoomObj === "string"
    )
        return <div>loading...</div>;
    // typeof string cus "" is loading state

    // in the case where conversationRoom is null when no conversation room yet
    // we use recipientUsers details in rendering the chat header
    //              for syncing purposes

    const conversationRoom = currentRoomObj.room;
    const currentRecipient = currentRoomObj.recipient;

    return (
        <>
            <div className="flex flex-col gap-5">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleListState();
                    }}
                    className="self-start cursor-pointer"
                >
                    <ArrowLeft size={25} />
                </button>
                <div className="flex items-center gap-3 font-[700] text-lg  ">
                    <ProfilePicture
                        src={
                            conversationRoom
                                ? currentRoomObj.recipient.pfp_url
                                : currentRecipient.pfp_url
                        }
                    />
                    <h1>
                        {conversationRoom
                            ? (currentRoomObj.recipient.display_name ??
                              currentRoomObj.recipient.username)
                            : (currentRecipient.display_name ??
                              currentRecipient.username)}
                    </h1>
                </div>
                <div className=" bg-base-200 rounded-sm p-1 flex flex-col gap-5">
                    <div>
                        {typeof conversationRoom === "string" ? (
                            <div>loading...</div>
                        ) : !conversationRoom ? (
                            <h1 className="text-center mt-3">
                                spark a conversation
                            </h1>
                        ) : (
                            <ChatMessagesSection
                                room={conversationRoom}
                                fetchMessages={fetchMessages}
                                messagesObj={messagesObj}
                                hasMore={hasMore}
                                loading={loading}
                            />
                        )}
                    </div>
                    <form
                        onSubmit={onSendSubmit}
                        className="flex gap-3 items-center px-2"
                    >
                        <input
                            type="text"
                            value={message}
                            className="input input-sm"
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <button className="opacity-80">
                            <SendIcon size={30} />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default ChatRoom;
