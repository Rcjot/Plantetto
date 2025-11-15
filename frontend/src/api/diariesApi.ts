import axios from "@/lib/axios";
import type { PlantOptionType } from "@/features/garden/gardenTypes";
import { isAxiosError } from "axios";
import type {
    DiaryCardType,
    PlantDiaryType,
} from "@/features/diary/diaryTypes";

async function getUserPlantsOptions(username: string) {
    try {
        const { data } = await axios.get(`users/${username}/plants_options`);
        const plantOptions: PlantOptionType[] = data["plant_options"];
        return { ok: true, plantOptions: plantOptions };
    } catch {
        return { ok: false, plantOptions: [] };
    }
}

async function addDiaryEntry(formData: FormData) {
    try {
        const { data } = await axios.post("/diaries/", formData);
        const diary: PlantDiaryType = data["diary"];
        return { ok: true, diary: diary };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: "some error occurred" } };
    }
}

async function editDiaryEntry(formData: FormData, diary_uuid: string) {
    try {
        const { data } = await axios.put(`/diaries/${diary_uuid}`, formData);
        const diary: PlantDiaryType = data["diary"];
        return { ok: true, diary: diary };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: "some error occurred" } };
    }
}

async function deleteDiaryEntry(diary_uuid: string) {
    try {
        const { data } = await axios.delete(`/diaries/${diary_uuid}`);
        const diary: PlantDiaryType = data["diary"];
        return { ok: true, diary: diary };
    } catch (error) {
        console.error(error);

        return { ok: false };
    }
}

async function fetchDiariesToday() {
    try {
        const { data } = await axios.get(`/diaries/`);
        const plantDiaries: DiaryCardType[] = data["diaries"];
        return { ok: true, plantDiaries: plantDiaries };
    } catch {
        return { ok: false, plantDiaries: [] };
    }
}

async function fetchDiariesTodayFollowing() {
    try {
        const { data } = await axios.get(`/diaries/following`);
        const plantDiaries: DiaryCardType[] = data["diaries"];
        return { ok: true, plantDiaries: plantDiaries };
    } catch {
        return { ok: false, plantDiaries: [] };
    }
}

export default {
    getUserPlantsOptions,
    addDiaryEntry,
    editDiaryEntry,
    deleteDiaryEntry,
    fetchDiariesToday,
    fetchDiariesTodayFollowing,
};
