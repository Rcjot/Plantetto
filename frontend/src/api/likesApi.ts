import axios from "@/lib/axios";

async function toggleLikePost(postUuid: string) {
    try {
        const { data } = await axios.post(`/posts/${postUuid}/likes/`);

        return { ok: true, action: data["action"] };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function toggleLikeGuide(guideUuid: string) {
    try {
        const { data } = await axios.post(`/guides/${guideUuid}/likes/`);

        return { ok: true, action: data["action"] };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function toggleLikeCommentPost(commentUuid: string) {
    try {
        const { data } = await axios.post(
            `/posts/comments/${commentUuid}/likes/`
        );

        return { ok: true, action: data["action"] };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function toggleLikeCommentGuide(commentUuid: string) {
    try {
        const { data } = await axios.post(
            `/guides/comments/${commentUuid}/likes/`
        );

        return { ok: true, action: data["action"] };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

export default {
    toggleLikePost,
    toggleLikeGuide,
    toggleLikeCommentPost,
    toggleLikeCommentGuide,
};
