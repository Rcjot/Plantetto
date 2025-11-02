import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import type { SignupFields } from "@/features/signup/SignupForm";

async function fetchMe() {
    const { data, status, headers } = await axios.get("/me");

    console.log(status, data, headers);
    return { data, status, headers };
}

async function signupUser(signupFormData: SignupFields) {
    try {
        const { data, status } = await axios.post("/signup", signupFormData);
        console.log(status, data);
        return { ok: true, data };
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            console.log(error.response.data.error);
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: "some error occurred" } };
    }
}

export default { fetchMe, signupUser };