import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import type { SignupFields } from "@/features/signup/SignupForm";
import type { SigninFields } from "@/features/signin/SigninForm";
import type { AuthType } from "@/features/auth/authTypes";

async function fetchMe() {
    try {
        const { data } = await axios.get("/me");
        const auth: AuthType = {
            status: data["status"],
            user: data["user"],
        };
        return { ok: true, auth };
    } catch (error) {
        console.error(error);
        const auth: AuthType = {
            status: "loading",
            user: null,
        };
        return { ok: false, auth };
    }
}

async function signupUser(signupFormData: SignupFields) {
    try {
        const { data } = await axios.post("/signup", signupFormData);
        return { ok: true, data };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: "some error occurred" } };
    }
}

async function signinUser(signinFormData: SigninFields) {
    try {
        const { data } = await axios.post("/signin", signinFormData);
        const auth: AuthType = {
            status: "authenticated",
            user: data["user"],
        };

        return { ok: true, auth };
    } catch (error) {
        console.error(error);
        const auth: AuthType = {
            status: "unauthenticated",
            user: null,
        };
        if (isAxiosError(error) && error.response) {
            return { ok: false, auth, errors: error.response.data.error };
        }

        return { ok: false, auth, errors: { root: "some error occurred" } };
    }
}

async function logoutUser() {
    try {
        await axios.get("/logout");
        return { ok: true };
    } catch (error) {
        console.error(error);
        return { ok: false };
    }
}

export default { fetchMe, signupUser, signinUser, logoutUser };
