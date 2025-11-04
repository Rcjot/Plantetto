export interface UserType {
    id: string;
    username: string;
    pfp_url: string;
    display_name: string | null;
}

export interface AuthType {
    status: "loading" | "authenticated" | "unauthenticated";
    user: UserType | null;
}

export interface AuthContextType {
    auth: AuthType;
    signin: (auth: AuthType) => void;
    logout: () => Promise<void>;
    fetchCredentials: () => Promise<void>;
}
