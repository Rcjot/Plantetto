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
    comment_count: number;
    like_count: number;
    liked: boolean;
    bookmarked: boolean;
}

export interface PostContextType {
    post: PostType;
    updateCaption: (newCaption: string) => void;
    openEdit: boolean;
    setOpenEditCallback: (open: boolean) => void;
    origin?: string;
}

export interface CreatePostFormType {
    media: File[];
    preview: MediaType[];
}

export interface CreatePostContextType {
    createPostForm: CreatePostFormType;
    setCreatePostForm: React.Dispatch<React.SetStateAction<CreatePostFormType>>;
    caption: string;
    setCaption: React.Dispatch<React.SetStateAction<string>>;
    appendPost: (newPost: PostType) => void;
}