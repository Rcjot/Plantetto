import type { AuthType } from "./authTypes";
import { useCallback, useEffect, useState } from "react";
import authApi from "@/api/authApi";
import { io } from "socket.io-client";

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
        const socket = io("http://arsi.local:5000");
        socket.connect();
        // socket.emit("connect");
        socket.on("connect", function () {
            socket.emit("message", "hello");
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
