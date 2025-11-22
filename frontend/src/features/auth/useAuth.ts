import type { AuthType } from "./authTypes";
import { useCallback, useEffect, useState } from "react";
import authApi from "@/api/authApi";
import socket from "@/lib/socket";

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
        // socket.connect();
        socket.on("connect", function () {
            socket.emit("join", { username: "test", room: "test_room" });
        });
    });

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
