import axios from "@/lib/axios";

async function followUser(username: string) {
    try {
        const { data } = await axios.post(`/follow/${username}`);
        return { ok: true, data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function unfollowUser(username: string) {
    try {
        const { data } = await axios.delete(`/follow/${username}`);
        return { ok: true, data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}
async function patchNotification(username: string, type: "post" | "guide") {
    try {
        const { data } = await axios.patch(
            `/follow/${username}?notif_type=${type}`
        );
        return { ok: true, data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function getNotifStatus(username: string) {
    try {
        const { data } = await axios.get(`/follow/${username}/notifications`);

        return { ok: true, notificationStatus: data["notif_status"] };
    } catch (error) {
        console.error(error);
        return { ok: false, notificationStatus: null };
    }
}

async function checkFollowStatus(username: string) {
    try {
        const { data } = await axios.get(`/follow/${username}/status`);
        return { ok: true, isFollowing: data.is_following };
    } catch (error) {
        console.error(error);
        return { ok: false, isFollowing: false };
    }
}

async function getFollowCounts(username: string) {
    try {
        const { data } = await axios.get(`/follow/${username}/counts`);
        return { ok: true, counts: data.counts };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            counts: { followers_count: 0, following_count: 0 },
        };
    }
}

async function getFollowers(username: string) {
    try {
        const { data } = await axios.get(`/follow/${username}/followers`);
        return { ok: true, followers: data.followers };
    } catch (error) {
        console.error(error);
        return { ok: false, followers: [] };
    }
}

async function getFollowing(username: string) {
    try {
        const { data } = await axios.get(`/follow/${username}/following`);
        return { ok: true, following: data.following };
    } catch (error) {
        console.error(error);
        return { ok: false, following: [] };
    }
}

export default {
    followUser,
    unfollowUser,
    checkFollowStatus,
    getFollowCounts,
    getFollowers,
    getFollowing,
    patchNotification,
    getNotifStatus,
};
