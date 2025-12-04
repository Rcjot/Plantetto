import type { UserType } from "@/features/auth/authTypes";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

interface commentType {
    uuid: string;
    content: string;
    author: UserType;
    created_at: string;
    last_edit_date: string;
}

async function getCommentsUnderPost(post_uuid: string) {
    try {
        const { data } = await axios.get(`/posts/${post_uuid}/comments`);

        // The response has { comments: [...], success: true }
        // NOT { "comments:": [...] }
        let commentsArray = [];

        if (data && typeof data === "object") {
            // Try data.comments first (without colon)
            if (data.comments && Array.isArray(data.comments)) {
                commentsArray = data.comments;
            }
            // Also check for data["comments:"] as fallback
            else if (data["comments:"] && Array.isArray(data["comments:"])) {
                commentsArray = data["comments:"];
            }
        }

        const comments: commentType[] = commentsArray;

        return { ok: true, comments: comments };
    } catch (error) {
        console.error(error);
        return { ok: false, comments: null };
    }
}

async function addComment(
    post_uuid: string,
    content: string,
    parent_uuid: string | null
) {
    try {
        // parent uuid is null if its a comment of the main post
        const { data } = await axios.post(`/posts/${post_uuid}/comments`, {
            content: content,
            parent_uuid: parent_uuid,
        });
        return { ok: true, comment_uuid: data["comment_uuid"] };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function patchContent(
    post_uuid: string,
    comment_uuid: string,
    content: string
) {
    try {
        const { data } = await axios.patch(
            `/posts/${post_uuid}/comments/${comment_uuid}`,
            {
                content: content,
            }
        );
        return { ok: true, guide_uuid: data["guide_uuid"] };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function deleteComment(post_uuid: string, comment_uuid: string) {
    try {
        await axios.delete(`/posts/${post_uuid}/comments/${comment_uuid}`);
        return { ok: true };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

export default {
    addComment,
    patchContent,
    getCommentsUnderPost,
    deleteComment,
};
