export interface User {
    id: string;
    username: string;
    pfp_url: string;
}

export interface AuthType {
    status: "loading" | "authenticated" | "unauthenticated";
    user: User | null;
}

export interface AuthContextType {
    auth: AuthType;
    signin: (auth: AuthType) => void;
    logout: () => Promise<void>;
    fetchCredentials: () => Promise<void>;
}
