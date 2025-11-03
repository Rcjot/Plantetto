import axios from "@/lib/axios";

async function sendImage(formData: FormData) {
    await axios.post("/profile/upload", formData);
}

async function fetchProfileDetails(username: string) {
    try {
        const { data } = await axios.get(`/profile/${username}`);

        return { user: data["user"] };
    } catch {
        return { user: null };
    }
}

export default { sendImage, fetchProfileDetails };
