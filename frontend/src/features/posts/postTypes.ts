import type { UserType } from "../auth/authTypes";

export interface MediaType {
    url: string;
    type: "image" | "video";
    order: number;
}

export interface PostType {
    post_uuid: string;
    author: UserType;
    caption: string;
    created_at: string;
    media: MediaType[];
    highlight_width: number;
    highlight_height: number;
}
