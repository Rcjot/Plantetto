import { createContext, useContext } from "react";
import type { AuthContextType } from "./authTypes";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => useContext(AuthContext);