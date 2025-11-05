import { createContext, useContext } from "react";
import type { PostContextType } from "../postTypes";
import type { CreatePostContextType } from "../postTypes";

export const PostContext = createContext<PostContextType | null>(null);

export const usePostContext = () => useContext(PostContext);

export const CreatePostContext = createContext<CreatePostContextType | null>(
    null
);

export const useCreatePostContext = () => useContext(CreatePostContext);
