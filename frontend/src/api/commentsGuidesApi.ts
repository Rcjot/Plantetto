import axios from "@/lib/axios";
import { isAxiosError } from "axios";

interface commentType {
    uuid: string;
    content: string;
    author: {
        id: string;
        username: string;
        display_name: string | null;
        pfp_url: string | null;
    };
    created_at: string;
    last_edit_date: string | null;
    parent_uuid?: string | null;
    children?: commentType[];
    has_more_replies?: boolean;
}

async function getCommentsUnderGuide(guide_uuid: string, parent_uuid?: string) {
    try {
        const url = parent_uuid
            ? `/guides/${guide_uuid}/comments?parent_uuid=${parent_uuid}` // REMOVED /api/
            : `/guides/${guide_uuid}/comments`; // REMOVED /api/

        const { data } = await axios.get(url);
        const comments: commentType[] =
            data.comments || data["comments:"] || [];

        return { ok: true, comments: comments };
    } catch (error) {
        console.error(error);
        return { ok: false, comments: [] };
    }
}

async function addComment(
    guide_uuid: string,
    content: string,
    parent_uuid: string
) {
    try {
        // parent uuid is null if its a comment of the main guide
        const { data } = await axios.post(`/guides/${guide_uuid}/comments`, {
            // KEEP as is (no /api/)
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
    guide_uuid: string,
    comment_uuid: string,
    content: string
) {
    try {
        const { data } = await axios.patch(
            `/guides/${guide_uuid}/comments/${comment_uuid}`, // REMOVED /api/
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

async function deleteComment(guide_uuid: string, comment_uuid: string) {
    try {
        await axios.delete(
            `/guides/${guide_uuid}/comments/${comment_uuid}` // REMOVED /api/
        );
        return { ok: true };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

export default {
    addComment,
    patchContent,
    getCommentsUnderGuide,
    deleteComment,
};
