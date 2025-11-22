import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import socket, { sendMessage } from "@/lib/socket";
import type { UserType } from "../auth/authTypes";

interface ChatRoomProps {
    recipientUser: UserType | null;
    conversationRoom: string | null;
}

function ChatRoom({ recipientUser, conversationRoom }: ChatRoomProps) {
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
        const handler = (data: string) => {
            console.log("handler response", data);
        };
        socket.on("new_message", handler);

        return () => {
            socket.off("new_message", handler);
        };
    }, []);

    return (
        <>
            <div>
                <h1>current room : {recipientUser?.username}</h1>
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
