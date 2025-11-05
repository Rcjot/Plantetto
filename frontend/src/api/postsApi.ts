import type { PostType } from "@/features/posts/postTypes";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

async function createPost(formData: FormData) {
    try {
        const { data } = await axios.post("/posts", formData);
        const newPost: PostType = data["new_post"];
        const resErrors: {
            caption: string[];
            media: string[];
            root: string[];
        } = data["error"];
        return { ok: true, newPost: newPost, resErrors: resErrors };
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const resErrors: {
                caption: string[];
                media: string[];
                root: string[];
            } = error.response.data["error"];
            return { ok: false, newPost: null, resErrors: resErrors };
        }
        return {
            ok: false,
            newPost: null,
            resErrors: {
                caption: [],
                media: [],
                root: ["some error occurred"],
            },
        };
    }
}

async function editPost(post_uuid: string, formData: FormData) {
    try {
        await axios.put(`/posts/${post_uuid}`, formData);
        return { ok: true };
    } catch {
        return { ok: false };
    }
}

async function deletePost(post_uuid: string) {
    try {
        await axios.delete(`/posts/${post_uuid}`);
        return { ok: true };
    } catch {
        return { ok: false };
    }
}

async function fetchPosts(cursorId: number | null) {
    const { data } = await axios.get(`/posts?next_cursor=${cursorId}`);
    const posts: PostType[] = data["feed"];
    const nextCursor: number | null = data["next_cursor"];
    return { posts, nextCursor };
}

async function fetchPostByUUID(post_uuid: string) {
    const { data } = await axios.get(`/posts/${post_uuid}`);
    const post: PostType = data["post"];
    return post;
}

export default {
    createPost,
    editPost,
    deletePost,
    fetchPosts,
    fetchPostByUUID,
};
