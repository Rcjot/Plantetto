import type { PostType } from "@/features/posts/postTypes";

const STORAGE_PREFIX = "recent:";
const RECENTS_UPDATED_EVENT = "recents:updated";

export type RecentItem = {
    post_uuid: string;
};

function getStorageKey(userId: string) {
    return `${STORAGE_PREFIX}${userId}`;
}

export function getRecentPostUUIDs(userId: string): string[] {
    try {
        const key = getStorageKey(userId);
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as string[];
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch {
        return [];
    }
}

export function setRecentPostUUIDs(userId: string, uuids: string[]) {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(uuids));
    window.dispatchEvent(new CustomEvent(RECENTS_UPDATED_EVENT, { detail: { userId } }));
}

export function clearRecents(userId: string) {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(RECENTS_UPDATED_EVENT, { detail: { userId } }));
}

export function addRecentPost(userId: string, post: PostType) {
    // Exclude user's own posts
    if (post.author.id === userId) return;
    const existing = getRecentPostUUIDs(userId);
    const without = existing.filter((id) => id !== post.post_uuid);
    const next = [post.post_uuid, ...without].slice(0, 20);
    setRecentPostUUIDs(userId, next);
}

export function onRecentsUpdated(listener: (e: CustomEvent<{ userId: string }>) => void) {
    const handler = listener as EventListener;
    window.addEventListener(RECENTS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(RECENTS_UPDATED_EVENT, handler);
}

export function removeRecentPost(userId: string, post_uuid: string) {
    const existing = getRecentPostUUIDs(userId);
    const next = existing.filter((id) => id !== post_uuid);
    setRecentPostUUIDs(userId, next);
}

export function notifyRecentsUpdated(userId: string) {
    window.dispatchEvent(new CustomEvent(RECENTS_UPDATED_EVENT, { detail: { userId } }));
}


