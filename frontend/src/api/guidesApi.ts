import type { GuideType } from "@/features/guides/guideTypes";
import axios from "@/lib/axios";

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

export default {
    getUserBoard,
    getGuide,
};
