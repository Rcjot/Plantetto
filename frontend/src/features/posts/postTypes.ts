import type { UserType } from "../auth/authTypes";
import type { PlantOptionType } from "../garden/gardenTypes";

export interface MediaType {
    url: string;
    type: "image" | "video";
    order: number;
}

export interface PostType {
    post_uuid: string;
    author: UserType;
    caption: string;
    visibility: "everyone" | "private" | "for_me";
    created_at: string;
    media: MediaType[];
    planttags: PlantOptionType[];
    highlight_width: number;
    highlight_height: number;
    comment_count: number;
}

export interface PostContextType {
    post: PostType;
    updatePost: (
        newCaption: string,
        visibility: "everyone" | "private" | "for_me",
        plantTags: PlantOptionType[]
    ) => void;
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
    visibility: "everyone" | "private" | "for_me";
    setVisibility: React.Dispatch<
        React.SetStateAction<"everyone" | "private" | "for_me">
    >;
    plantTags: PlantOptionType[];
    setPlantTags: React.Dispatch<React.SetStateAction<PlantOptionType[]>>;
    appendPost: (newPost: PostType) => void;
}
