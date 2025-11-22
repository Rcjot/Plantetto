import { useEffect, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import socket, { joinRoom, sendMessage } from "@/lib/socket";

function ChatDropdown() {
    const { auth } = useAuthContext()!;
    const [room, setRoom] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [joinedRoom, setJoinedRoom] = useState<string>("");

    function onJoinSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (auth.user) {
            joinRoom(auth.user.username, room);
            setJoinedRoom(room);
        }
    }
    function onSendSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (auth.user) {
            sendMessage(auth.user.username, message, joinedRoom);
        }
    }

    useEffect(() => {
        const handler = (data: string) => {
            console.log(data);
        };
        socket.on("receive", handler);

        return () => {
            socket.off("receive", handler);
        };
    }, []);

    return (
        <>
            <div
                tabIndex={-1}
                className="right-11 dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm w-[300px] h-[calc(100dvh-60px)]"
            >
                <h1>current room : {joinedRoom}</h1>
                <form onSubmit={onJoinSubmit}>
                    <div>
                        <label>room</label>
                        <input
                            type="text"
                            value={room}
                            className="input"
                            onChange={(e) => setRoom(e.target.value)}
                            required
                        />
                    </div>

                    <button className="btn btn-primary">join room</button>
                </form>
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
                <div></div>
            </div>
        </>
    );
}

export default ChatDropdown;
