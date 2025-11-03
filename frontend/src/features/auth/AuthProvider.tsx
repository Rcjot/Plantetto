import { AuthContext } from "./AuthContext";
import { useMemo } from "react";
import useAuth from "./useAuth";

function AuthProvider({ children }: { children: React.ReactNode }) {
    const { auth, signin, logout } = useAuth();
    const contextValue = useMemo(
        () => ({
            auth,
            signin,
            logout,
        }),
        [auth, signin, logout]
    );
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;