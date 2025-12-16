import type { CommentType } from "@/features/comments/commentTypes";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

async function getCommentsUnderPost(
    post_uuid: string,
    nextCursor: null | string
) {
    try {
        const { data } = await axios.get(
            `/posts/${post_uuid}/comments?cursor=${nextCursor}`
        );

        let commentsArray = [];

        if (data && typeof data === "object") {
            if (data.comments && Array.isArray(data.comments)) {
                commentsArray = data.comments;
            } else if (data["comments:"] && Array.isArray(data["comments:"])) {
                commentsArray = data["comments:"];
            }
        }

        const comments: CommentType[] = commentsArray;
        const totalCount: number = data["total_count"];
        const nextCursorRes: string | null = data["next_cursor"];

        return {
            ok: true,
            comments: comments,
            totalCount: totalCount,
            nextCursor: nextCursorRes,
        };
    } catch (error) {
        console.error(error);
        return { ok: false, comments: [], totalCount: 0, nextCursor: null };
    }
}

async function addComment(
    post_uuid: string,
    content: string,
    parent_uuid: string | null
) {
    try {
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
