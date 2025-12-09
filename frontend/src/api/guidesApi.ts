import type { GuideType } from "@/features/guides/guideTypes";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

async function getUserBoard(
    username: string,
    search: string,
    plant_type_id: number | undefined,
    page: number,
    sort: string,
    status: string
) {
    try {
        const { data } = await axios.get(
            `/users/${username}/board?page=${page}&search=${search}&plant_type_id=${plant_type_id}&sort=${sort}&status=${status}`
        );

        const board: GuideType[] = data["board"];
        const meta_data = data["meta_data"];

        return { ok: true, board: board, meta_data };
    } catch (error) {
        console.error(error);
        return { ok: false, board: null };
    }
}

async function getPublishedGuides(
    search: string,
    plant_type_id: number | undefined,
    page: number
) {
    try {
        const { data } = await axios.get(
            `/guides/?page=${page}&search=${search}&plant_type_id=${plant_type_id}`
        );

        const guides: GuideType[] = data["guides"];
        const meta_data = data["meta_data"];

        return { ok: true, guides: guides, meta_data };
    } catch (error) {
        console.error(error);
        return { ok: false, guides: [] };
    }
}

async function getUserPublishedGuides(
    username: string,
    search: string,
    plant_type_id: number | undefined,
    page: number
) {
    try {
        const { data } = await axios.get(
            `users/${username}/guides?page=${page}&search=${search}&plant_type_id=${plant_type_id}`
        );

        const guides: GuideType[] = data["guides"];
        const meta_data = data["meta_data"];

        return { ok: true, guides: guides, meta_data };
    } catch (error) {
        console.error(error);
        return { ok: false, guides: [] };
    }
}

async function getGuide(guide_uuid: string) {
    try {
        const { data } = await axios.get(`/guides/${guide_uuid}`);

        const guide: GuideType = data["guide"];

        return { ok: true, guide: guide };
    } catch (error) {
        console.error(error);
        return { ok: false, guide: null };
    }
}

async function patchMetaGuide(guide_uuid: string, formData: FormData) {
    try {
        const { data } = await axios.patch(
            `/guides/${guide_uuid}/metadata`,
            formData
        );
        const guide: GuideType = data["guide"];
        return { ok: true, guide: guide };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function patchContentGuide(guide_uuid: string, content: object) {
    try {
        const { data } = await axios.patch(`/guides/${guide_uuid}/content`, {
            content: content,
        });
        const guide: GuideType = data["guide"];
        return { ok: true, guide: guide };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function patchStatusGuide(
    guide_uuid: string,
    status: "draft" | "published"
) {
    try {
        await axios.patch(`/guides/${guide_uuid}/status`, {
            status: status,
        });
        return { ok: true };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function deleteGuide(guide_uuid: string) {
    try {
        await axios.delete(`/guides/${guide_uuid}`);
        return { ok: true };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

async function uploadImage(
    guide_uuid: string,
    formData: FormData,
    onProgress?: (event: { progress: number }) => void,
    abortSignal?: AbortSignal
) {
    try {
        const { data } = await axios.post(
            `/guides/${guide_uuid}/images`,
            formData,
            {
                onUploadProgress: (event) => {
                    if (abortSignal?.aborted) {
                        throw new Error("Upload cancelled");
                    }
                    const total = event.total ?? 1;
                    const progress = Math.round((event.loaded * 100) / total);
                    onProgress?.({ progress });
                },
            }
        );
        return { ok: true, image_url: data["image_url"] };
    } catch (error) {
        console.error(error);
        return { ok: false, image_url: null };
    }
}

async function createGuide() {
    try {
        const { data } = await axios.post(`/guides/`);
        return { ok: true, guide_uuid: data["guide_uuid"] };
    } catch (error) {
        console.error(error);
        return { ok: false, image_url: null };
    }
}

export default {
    getUserBoard,
    getGuide,
    getPublishedGuides,
    getUserPublishedGuides,
    patchMetaGuide,
    patchContentGuide,
    patchStatusGuide,
    deleteGuide,
    uploadImage,
    createGuide,
};
