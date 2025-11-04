import axios from "@/lib/axios";
import type { PlantType, PlanttypeType } from "@/features/garden/gardenTypes";

async function addPlant(formData: FormData) {
    try {
        const { data } = await axios.post("/plants", formData);

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

async function fetchPlantsOfUser(username: string) {
    try {
        const { data } = await axios.get(`/user/${username}/plants/`);
        const plants: PlantType[] = data["plants"];
        return { ok: true, plants: plants };
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

async function fetchPlantTypes() {
    try {
        const { data } = await axios.get("/plants/planttypes");
        const plant_types: PlanttypeType[] = data["plant_types"];
        return { ok: true, plant_types: plant_types };
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
