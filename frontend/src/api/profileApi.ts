import type { SearchedUserType } from "@/features/auth/authTypes";
import axios from "@/lib/axios";

async function sendImage(formData: FormData) {
    await axios.post("/users/upload", formData);
}

async function fetchProfileDetails(username: string) {
    try {
        const { data } = await axios.get(`/users/${username}`);

        return { user: data["user"] };
    } catch {
        return { user: null };
    }
}

async function setProfile(formData: FormData) {
    try {
        const { data } = await axios.post("/users/update", formData);
        return { ok: true, data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function exploreUsers(search: string, cursor?: string | null) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (cursor) params.append("cursor", cursor); // only add if not null/undefined

    const { data } = await axios.get(`/users/explore?${params.toString()}`);
    const users: SearchedUserType[] = data["users"];
    const nextCursor: string | null = data["next_cursor"];
    return { users, nextCursor };
}

export default { sendImage, setProfile, fetchProfileDetails, exploreUsers };
