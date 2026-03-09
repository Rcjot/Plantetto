export interface UserType {
    id: string;
    username: string;
    email: string;
    email_verified: boolean;
    seller_verified: boolean;
    pfp_url: string;
    display_name: string | null;
}

export interface SearchedUserType extends UserType {
    is_following: boolean;
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

