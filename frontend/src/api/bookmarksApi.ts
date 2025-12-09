import type { PostType } from "@/features/posts/postTypes";
import type { GuideType } from "@/features/guides/guideTypes";
import axios from "@/lib/axios";

async function fetchBookmarkedPosts(page: number, limit: number = 10) {
    const { data } = await axios.get(
        `/bookmarks/posts?page=${page}&limit=${limit}`
    );
    return { ok: true, posts: data["feed"] as PostType[] };
}

async function fetchBookmarkedGuides(page: number, limit: number = 12) {
    const { data } = await axios.get(
        `/bookmarks/guides?page=${page}&limit=${limit}`
    );
    return { ok: true, guides: data["guides"] as GuideType[] };
}

async function toggleBookmarkPost(postUuid: string) {
    try {
        const { data } = await axios.post(`/posts/${postUuid}/bookmarks/`);
        return { ok: true, action: data["action"] };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function toggleBookmarkGuide(guideUuid: string) {
    try {
        const { data } = await axios.post(`/guides/${guideUuid}/bookmarks/`);
        return { ok: true, action: data["action"] };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

export default {
    fetchBookmarkedPosts,
    fetchBookmarkedGuides,
    toggleBookmarkPost,
    toggleBookmarkGuide,
};