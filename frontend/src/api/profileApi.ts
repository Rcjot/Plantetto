import axios from "@/lib/axios";

async function sendImage(formData: FormData) {
    await axios.post("/users/upload", formData);
}

async function fetchProfileDetails(username: string) {
    try {
        const { data } = await axios.get(`/users/${username}`);

        return { user: data["user"] };
    } catch {
        return { user: null };
    }
}

async function setProfile(formData: FormData) {
    try {
        const { data } = await axios.post("/users/update", formData);
        return { ok: true, data };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

export default { sendImage, setProfile, fetchProfileDetails };
