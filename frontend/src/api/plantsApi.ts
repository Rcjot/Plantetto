import axios from "@/lib/axios";
import type { PlantType, PlanttypeType } from "@/features/garden/gardenTypes";

async function addPlant(formData: FormData) {
    try {
        const { data } = await axios.post("/plants/", formData);

        return { ok: true, plant: data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function editPlant(plant_uuid: string, formData: FormData) {
    try {
        const { data } = await axios.put(`/plants/${plant_uuid}`, formData);

        return { ok: true, plant: data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function deletePlant(plant_uuid: string) {
    try {
        await axios.put(`/plants/${plant_uuid}`);

        return { ok: true };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function fetchPlantsOfUser(
    username: string,
    search: string,
    plant_type_id: number | undefined,
    page: number
) {
    try {
        const { data } = await axios.get(
            `/users/${username}/plants?page=${page}&search=${search}&plant_type_id=${plant_type_id}`
        );
        const meta_data = data["meta_data"];
        const plants: PlantType[] = data["plants"];
        return { ok: true, plants: plants, meta_data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

async function fetchPlant(plant_uuid: string) {
    try {
        const { data } = await axios.get(`/plants/${plant_uuid}`);
        const plant: PlantType = data["plant"];
        return { ok: true, plant: plant };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

export interface MetaDataType {
    page: number;
    total_count: number;
    limit: number;
    max_page: number;
    has_next: boolean;
    has_prev: boolean;
}

async function fetchPlantTypes() {
    try {
        const { data } = await axios.get("/plants/planttypes");
        const plant_types: PlanttypeType[] = data["plant_types"];
        const meta_data: MetaDataType = data["meta_data"];
        return { ok: true, plant_types: plant_types, meta_data: meta_data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

export default {
    addPlant,
    editPlant,
    deletePlant,
    fetchPlantsOfUser,
    fetchPlant,
    fetchPlantTypes,
};
