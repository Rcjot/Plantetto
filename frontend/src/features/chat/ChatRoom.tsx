import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import socket, { sendMessage } from "@/lib/socket";
import type { UserType } from "../auth/authTypes";
import ProfilePicture from "@/components/ProfilePicture";
import { ArrowLeft } from "lucide-react";

interface ChatRoomProps {
    recipientUser: UserType | null;
    conversationRoom: string | null;
    toggleListState: () => void;
}

function ChatRoom({
    recipientUser,
    conversationRoom,
    toggleListState,
}: ChatRoomProps) {
    const { auth } = useAuthContext()!;
    const [message, setMessage] = useState<string>("");

    function onSendSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (auth.user && recipientUser) {
            sendMessage(
                auth.user,
                auth.user.username,
                recipientUser.username,
                message,
                conversationRoom
            );
        }
    }

    useEffect(() => {
        console.log("listening to new messages");
        const handler = (data: string) => {
            console.log("handler response", data);
        };
        socket.on("new_message", handler);

        return () => {
            socket.off("new_message", handler);
        };
    }, []);
    // initially this is not mounted yet, so chatroom has to be opened to receive messages
    // transfer this when working in notifications.
    if (!recipientUser) return <div>loading...</div>;

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
                    <ProfilePicture src={recipientUser.pfp_url} />
                    <h1>
                        {recipientUser.display_name ?? recipientUser.username}
                    </h1>
                </div>

                <form onSubmit={onSendSubmit}>
                    <div>
                        <label>message</label>
                        <input
                            type="text"
                            value={message}
                            className="input"
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-primary">send</button>
                </form>
            </div>
        </>
    );
}
export default ChatRoom;
