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

        const hasAvailableCode: boolean = data["has_available_code"];

        return { ok: true, hasAvailableCode: hasAvailableCode };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return {
                ok: false,
                hasAvailableCode: null,
                errors: error.response.data.error,
            };
        }
        return {
            ok: false,
            hasAvailableCode: null,
            errors: { root: "some error occurred" },
        };
    }
}

async function verifyEmailSignup(code: string, email: string) {
    try {
        await axios.post("/verify_signup", {
            code: code,
            email: email,
        });

        return { ok: true };
    } catch {
        return {
            ok: false,
        };
    }
}

async function resendVerificationCode(email: string) {
    try {
        await axios.post("/resend_code", {
            email: email,
        });

        return { ok: true };
    } catch {
        return {
            ok: false,
        };
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

export default {
    fetchMe,
    signupUser,
    verifyEmailSignup,
    resendVerificationCode,
    signinUser,
    logoutUser,
};
