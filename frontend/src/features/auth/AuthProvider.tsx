import { AuthContext } from "./AuthContext";
import { useMemo } from "react";
import useAuth from "./useAuth";

function AuthProvider({ children }: { children: React.ReactNode }) {
    console.log("auth changed");
    const { auth, signin, logout, fetchCredentials } = useAuth();
    const contextValue = useMemo(
        () => ({
            auth,
            signin,
            logout,
            fetchCredentials,
        }),
        [auth, signin, logout, fetchCredentials]
    );
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
