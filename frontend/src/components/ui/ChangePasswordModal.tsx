import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import usersApi from "@/api/usersApi";

interface Props {
    title: string;
    onClose: () => void;
}

const schema = z.object({
    currentPassword: z.string().nonempty("required"),
    newPassword: z.string().min(8, "too short!").nonempty("required"),
    confirmNewPassword: z.string().nonempty("required"),
});

export type ChangePasswordFields = z.infer<typeof schema>;
type ChangePasswordFieldNames = keyof ChangePasswordFields;

const ChangePasswordModal: React.FC<Props> = ({ title, onClose }) => {
    const [hasAvailableCode, setHasAvailableCode] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFields>({
        resolver: zodResolver(schema),
    });

    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [codeError, setCodeError] = useState("");

    const onSubmit: SubmitHandler<ChangePasswordFields> = async (data) => {
        const res = await usersApi.changePassword(data);
        if (!res.ok) {
            (
                Object.entries(res.errors) as [
                    ChangePasswordFieldNames,
                    string[],
                ][]
            ).forEach(([field, messages]) => {
                setError(field, { message: messages[0] });
            });
        }
    };

    async function submitCode(e: React.FormEvent) {
        e.preventDefault();
        setVerifying(true);
        const { ok } = await usersApi.submitCodeForPasswordChange(code);
        if (!ok) {
            setCodeError("invalid code or expired");
        } else {
            onClose();
        }
        setVerifying(false);
    }

    useEffect(() => {
        const fetchStatus = async () => {
            const { ok, status } =
                await usersApi.getVerifCodeStatus("password");
            if (ok) {
                setHasAvailableCode(status);
            }
        };
        fetchStatus();
    });

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            {!hasAvailableCode ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white w-[90%] max-w-lg p-8 rounded-3xl shadow-md border border-gray-300"
                >
                    {/* Title */}
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        {title}
                    </h2>

                    {/* Inputs */}
                    <div className="flex flex-col gap-5">
                        <span className="text-warning-content">
                            {errors.currentPassword?.message}
                        </span>
                        <input
                            {...register("currentPassword")}
                            type="password"
                            placeholder="Current Password"
                            className="w-full px-4 py-4 border border-gray-400 rounded-xl text-gray-600 text-base
                                   focus:ring-2 focus:ring-secondary outline-none"
                        />
                        <span className="text-warning-content">
                            {errors.newPassword?.message}
                        </span>
                        <input
                            {...register("newPassword")}
                            type="password"
                            placeholder="New Password"
                            className="w-full px-4 py-4 border border-gray-400 rounded-xl text-gray-600 text-base
                                   focus:ring-2 focus:ring-secondary outline-none"
                        />
                        <span className="text-warning-content">
                            {errors.confirmNewPassword?.message}
                        </span>
                        <input
                            {...register("confirmNewPassword")}
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full px-4 py-4 border border-gray-400 rounded-xl text-gray-600 text-base
                                   focus:ring-2 focus:ring-secondary outline-none"
                        />
                    </div>
                    <span className="text-warning-content">
                        {errors.root?.message}
                    </span>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 py-3 rounded-xl 
                                   font-medium text-lg"
                        >
                            {isSubmitting ? "trying..." : "Change Password"}
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

export default ChangePasswordModal;