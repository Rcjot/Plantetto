import type { AuthType } from "./authTypes";
import { useCallback, useEffect, useState } from "react";
import authApi from "@/api/authApi";
import socket, { joinRoom, joinRooms } from "@/lib/socket";

function useAuth() {
    const [auth, setAuth] = useState<AuthType>({
        status: "loading",
        user: null,
    });

    const fetchCredentials = useCallback(async () => {
        const { ok, auth } = await authApi.fetchMe();
        if (ok) {
            setAuth(auth);
        }
    }, []);

    useEffect(() => {
        fetchCredentials();
    }, [fetchCredentials]);

    useEffect(() => {
        if (auth && auth.user != null) {
            socket.connect();
            const connectHandler = () => {
                joinRoom(auth.user!.username, auth.user!.id);
                joinRooms();
            };

            const requestJoinHandler = (conversationRoom: string) => {
                console.log("join requested to join", conversationRoom);
                joinRoom(auth.user!.username, conversationRoom);
            };

            socket.on("connect", connectHandler);

            // request_join is when server is notifying client/user to join a specific room
            // happens if another user without conversation history with initiates conversation
            socket.on("request_join", requestJoinHandler);

            return () => {
                socket.off("connect", connectHandler);
                socket.off("request_join", requestJoinHandler);
            };
        }
    }, [auth]);

    const signin = useCallback((auth: AuthType) => {
        setAuth(auth);
    }, []);

    const logout = useCallback(async () => {
        const { ok } = await authApi.logoutUser();
        if (ok) {
            setAuth({
                status: "unauthenticated",
                user: null,
            });
        }
    }, []);
    return {
        auth,
        signin,
        logout,
        fetchCredentials,
    };
}

export default useAuth;
