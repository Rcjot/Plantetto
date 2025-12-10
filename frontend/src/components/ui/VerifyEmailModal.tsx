import usersApi from "@/api/usersApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import React, { useEffect, useState } from "react";

interface Props {
    title: string;
    onClose: () => void;
}

const VerifyEmailModal: React.FC<Props> = ({ title, onClose }) => {
    const [verifCode, setVerifCode] = useState("");
    const [sendError, setSendError] = useState("");
    const [verifyingError, setVerifyingError] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const { auth, fetchCredentials } = useAuthContext()!;

    useEffect(() => {
        if (cooldown === 0) return;

        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0; // end cooldown
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // functions for verifying sent code
        setVerifying(true);
        const { ok } = await usersApi.verifyEmail(verifCode);
        if (ok) {
            onClose();
            fetchCredentials();
        } else {
            setVerifyingError("code sent has already expire or invalid");
        }
        setVerifying(false);
    }

    async function sendVerificationCode() {
        setSendError("");
        const { ok } = await usersApi.sendVerificationCode();
        setVerifyingError("");
        if (ok) {
            setCooldown(60);
        } else {
            setSendError("please try again later..");
        }
    }

    if (!auth.user) return <div>loading...</div>;
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white w-[90%] max-w-lg p-8 rounded-3xl shadow-md border border-gray-300"
            >
                {/* Title */}
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    {title}
                </h2>
                {/* Inputs */}
                <div className="flex flex-col gap-2">
                    <div className="text-base-200-content">
                        {auth.user.email}
                    </div>

                    <input
                        value={verifCode}
                        onChange={(e) => setVerifCode(e.target.value)}
                        placeholder="Enter verification code"
                        className="w-full px-4 py-4 border border-gray-400 rounded-xl text-neutral 
                                   focus:ring-2 focus:ring-secondary outline-none"
                    />
                    <button
                        type="button"
                        className="btn btn-base-300 btn-xs w-fit p-3 rounded-xl font-medium text-sm self-end "
                        onClick={sendVerificationCode}
                        disabled={cooldown > 0}
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Send Code"}
                    </button>
                    <div className="self-end text-warning-content">
                        {sendError}
                    </div>
                </div>
                {/* Buttons */}
                <div className="text-center text-warning-content ">
                    {verifyingError}
                </div>{" "}
                <div className="flex gap-4 mt-8">
                    <button
                        type="submit"
                        className="btn btn-primary flex-1 py-3 rounded-xl 
                                   font-medium text-lg"
                    >
                        {verifying ? "verifying..." : "Verify"}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-base-300 flex-1 py-3 rounded-xl  font-medium text-lg"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerifyEmailModal;