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

async function fetchPosts(cursor: string | null) {
    const params = new URLSearchParams();
    if (cursor) {
        params.append("cursor", cursor);
    }

    const { data } = await axios.get(`/posts?${params.toString()}`);
    const posts: PostType[] = data["feed"];
    const nextCursor: string | null = data["next_cursor"];
    return { posts, nextCursor };
}

async function fetchPostByUUID(post_uuid: string) {
    const { data } = await axios.get(`/posts/${post_uuid}`);
    const post: PostType = data["post"];
    return post;
}

async function explorePosts(search: string, cursor?: string | null) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    // dont append if null
    if (cursor && cursor !== "null") {
        params.append("cursor", cursor);
    }

    const { data } = await axios.get(`/posts/explore?${params.toString()}`);
    const posts: PostType[] = data["feed"];
    const nextCursor: string | null = data["next_cursor"];
    return { posts, nextCursor };
}

async function explorePostsOfPlant(
    plantTypeName: string,
    cursor?: string | null
) {
    const params = new URLSearchParams();
    params.append("planttype", plantTypeName);
    if (cursor) params.append("cursor", cursor); // only append if truthy

    const { data } = await axios.get(`/posts/explore?${params.toString()}`);
    const posts: PostType[] = data["feed"];
    const nextCursor: string | null = data["next_cursor"];
    return { posts, nextCursor };
}

export default {
    createPost,
    editPost,
    deletePost,
    fetchPosts,
    fetchPostByUUID,
    explorePosts,
    explorePostsOfPlant,
};
