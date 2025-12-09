import type { ChangePasswordFields } from "@/components/ui/ChangePasswordModal";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

async function changePassword(changePasswordData: ChangePasswordFields) {
    try {
        const { data } = await axios.patch(
            "/users/password",
            changePasswordData
        );
        return { ok: true, data };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: "some error occurred" } };
    }
}

async function changeEmail(newEmail: string) {
    try {
        const { data } = await axios.patch("/users/email", {
            newEmail: newEmail,
        });
        return { ok: true, data };
    } catch (error) {
        console.error(error);
        if (isAxiosError(error) && error.response) {
            return { ok: false, errors: error.response.data.error };
        }
        return { ok: false, errors: { root: "some error occurred" } };
    }
}

async function sendVerificationCode() {
    try {
        const { data } = await axios.post("/users/verification_code");

        const success = data["success"];
        return { ok: true, success };
    } catch (error) {
        console.error(error);
        return { ok: false, success: false };
    }
}

async function verifyEmail(code: string) {
    try {
        const { data } = await axios.post("/users/verify_email", {
            code: code,
        });
        console.log();
        const verified = data["verified"];
        return { ok: true, verified: verified };
    } catch (error) {
        console.error(error);
        return { ok: false, verified: false };
    }
}

export default {
    changePassword,
    changeEmail,
    sendVerificationCode,
    verifyEmail,
};