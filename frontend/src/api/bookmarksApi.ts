import type { PostType } from "@/features/posts/postTypes";
import type { GuideType } from "@/features/guides/guideTypes";
import type { MarketItemType } from "@/features/market/marketTypes";
import axios from "@/lib/axios";

async function fetchBookmarkedPosts(
    cursorId: number | null,
    limit: number = 10
) {
    const url = cursorId
        ? `/bookmarks/posts?next_cursor=${cursorId}&limit=${limit}`
        : `/bookmarks/posts?limit=${limit}`;

    const { data } = await axios.get(url);

    return {
        ok: true,
        posts: data["feed"] as PostType[],
        nextCursor: data["next_cursor"] as number | null,
    };
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

async function toggleBookmarkMarketItem(marketItemUuid: string) {
    try {
        const { data } = await axios.post(
            `/market/${marketItemUuid}/bookmarks/`
        );
        return { ok: true, action: data["action"] };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function fetchBookmarkedMarketItems(page: number, limit: number = 12) {
    const { data } = await axios.get(
        `/bookmarks/market?page=${page}&limit=${limit}`
    );
    return { ok: true, items: data["items"] as MarketItemType[] };
}

export default {
    fetchBookmarkedPosts,
    fetchBookmarkedGuides,
    toggleBookmarkPost,
    toggleBookmarkGuide,
    toggleBookmarkMarketItem,
    fetchBookmarkedMarketItems,
};
