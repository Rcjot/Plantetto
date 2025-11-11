import type { GuideType } from "@/features/guides/guideTypes";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

async function getUserBoard(username: string) {
    try {
        // const { data } = await axios.get(
        //     `/users/${username}/plants?page=${page}&search=${search}&plant_type_id=${plant_type_id}`
        // );

        // const meta_data = data["meta_data"];

        // const plants: PlantType[] = data["plants"];
        // return { ok: true, plants: plants, meta_data };

        const { data } = await axios.get(`/users/${username}/board`);

        const board: GuideType[] = data["board"];

        return { ok: true, board: board };
    } catch (error) {
        console.error(error);
        return { ok: false, board: null };
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
        const { data } = await axios.patch(`/guides/${guide_uuid}/metadata`, {
            content: content,
        });
        const guide: GuideType = data["guide"];
        return { ok: true, guide: guide };
    } catch (error) {
        console.error(error);

        return { ok: false, errors: { root: ["some error occurred"] } };
    }
}

export default {
    getUserBoard,
    getGuide,
    patchMetaGuide,
    patchContentGuide,
};
