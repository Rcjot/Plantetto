import usersApi from "@/api/usersApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import React, { useEffect, useState } from "react";

interface Props {
    title: string;
    onClose: () => void;
}

const ChangeEmailModal: React.FC<Props> = ({ title, onClose }) => {
    const [hasAvailableCode, setHasAvailableCode] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [errors, setErrors] = useState<{ newEmail: string; root: string }>({
        newEmail: "",
        root: "",
    });
    const [loading, setLoading] = useState(false);

    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [codeError, setCodeError] = useState("");

    const { auth, fetchCredentials } = useAuthContext()!;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        const res = await usersApi.changeEmail(newEmail);
        if (!res.ok) {
            console.log(res.errors);
            const constructedErrors = {
                newEmail:
                    res.errors.newEmail.length > 0
                        ? res.errors.newEmail[0]
                        : "",
                root: res.errors.root.length > 0 ? res.errors.root[0] : "",
            };
            setErrors(constructedErrors);
        } else {
            if (!auth.user?.email_verified) {
                fetchCredentials();
                onClose();
            }
        }
        setLoading(false);
    }

    async function submitCode(e: React.FormEvent) {
        e.preventDefault();
        setVerifying(true);
        const { ok } = await usersApi.submitCodeForEmailChange(code);
        console.log(auth.user?.email_verified);

        if (!ok) {
            setCodeError("invalid code or expired");
        } else {
            onClose();
            fetchCredentials();
        }
        setVerifying(false);
    }

    useEffect(() => {
        const fetchStatus = async () => {
            const { ok, status } = await usersApi.getVerifCodeStatus("email");
            if (ok) {
                setHasAvailableCode(status);
            }
        };
        fetchStatus();
    }, []);

    if (!auth.user) return <div>loading...</div>;
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            {!hasAvailableCode ? (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white w-[90%] max-w-lg p-8 rounded-3xl shadow-md border border-gray-300"
                >
                    {/* Title */}
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        {title}
                    </h2>

                    {/* Inputs */}
                    <div className="flex flex-col gap-5">
                        <div className="text-base-200-content">
                            current email <br />
                            {auth.user.email}
                        </div>
                        <div className="text-warning-content">
                            {errors.newEmail}
                        </div>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="New Email Address"
                            className="w-full px-4 py-4 border border-gray-400 rounded-xl text-neutral 
                                   focus:ring-2 focus:ring-secondary outline-none"
                        />
                        <div>{errors.root}</div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 py-3 rounded-xl 
                                   font-medium text-lg"
                        >
                            {loading ? "trying..." : "Change Email"}
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
            ) : (
                <form
                    onSubmit={submitCode}
                    className="bg-white w-[90%] max-w-lg p-8 rounded-3xl shadow-md border border-gray-300"
                >
                    {/* Title */}
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        {title}
                    </h2>
                    {/* Inputs */}
                    <div className="flex flex-col gap-2">
                        <input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter verification code"
                            className="w-full px-4 py-4 border border-gray-400 rounded-xl text-neutral 
                                   focus:ring-2 focus:ring-secondary outline-none"
                        />
                    </div>
                    <div className="text-warning-content">{codeError}</div>
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
            )}
        </div>
    );
};

export default ChangeEmailModal;
