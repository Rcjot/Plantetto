import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import usersApi from "@/api/usersApi";
import { usePasswordValidation } from "@/features/signup/usePasswordValidation";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

interface Props {
    title: string;
    onClose: () => void;
    username?: string;
}

const schema = z
    .object({
        currentPassword: z.string().nonempty("required"),
        newPassword: z.string().nonempty("required"),
        confirmNewPassword: z.string().nonempty("required"),
    })
    .superRefine((data, ctx) => {
        const password = data.newPassword;

        if (password.length < 8)
            ctx.addIssue({
                code: "custom",
                message: "Password must be at least 8 characters long",
                path: ["newPassword"],
            });
        if (!/[A-Z]/.test(password))
            ctx.addIssue({
                code: "custom",
                message:
                    "Must contain at least one uppercase letter (e.g. A-Z)",
                path: ["newPassword"],
            });
        if (!/\d/.test(password))
            ctx.addIssue({
                code: "custom",
                message: "Must contain at least one number (e.g. 0-9)",
                path: ["newPassword"],
            });
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/\\~`]/.test(password))
            ctx.addIssue({
                code: "custom",
                message:
                    "Must contain at least one special character (e.g. !@#$%^&*)",
                path: ["newPassword"],
            });

        const commonPasswords = [
            "password",
            "123456",
            "password123",
            "12345678",
            "qwerty",
            "abc123",
            "monkey",
            "letmein",
            "password1",
            "admin123",
        ];
        if (commonPasswords.includes(password.toLowerCase())) {
            ctx.addIssue({
                code: "custom",
                message: "Password is too common",
                path: ["newPassword"],
            });
        }

        if (data.newPassword !== data.confirmNewPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmNewPassword"],
            });
        }
    });

export type ChangePasswordFields = z.infer<typeof schema>;
type ChangePasswordFieldNames = keyof ChangePasswordFields;

const ChangePasswordModal: React.FC<Props> = ({ title, onClose, username }) => {
    const { calculateStats, getStrengthColor, getStrengthText } =
        usePasswordValidation();
    const [hasAvailableCode, setHasAvailableCode] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [code, setCode] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [codeError, setCodeError] = useState("");

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFields>({
        resolver: zodResolver(schema),
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    const newPassword = watch("newPassword", "");
    const { strength, percentage } = useMemo(
        () => calculateStats(newPassword),
        [newPassword]
    );

    const criteria = {
        minLength: newPassword.length >= 8,
        hasNumber: /\d/.test(newPassword),
        hasUpper: /[A-Z]/.test(newPassword),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/\\~`]/.test(newPassword),
    };

    const onSubmit: SubmitHandler<ChangePasswordFields> = async (data) => {
        if (
            username &&
            username.length >= 3 &&
            data.newPassword.toLowerCase().includes(username.toLowerCase())
        ) {
            setError("newPassword", {
                type: "custom",
                message: "Password cannot contain your username",
            });
            toast.info("Password cannot contain your username");
            return;
        }

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
        } else {
            setHasAvailableCode(true);
        }
    };

    const onError: SubmitErrorHandler<ChangePasswordFields> = (errors) => {
        const msg = errors.newPassword?.message;
        if (msg === "Password is too common") {
            toast.info("Password is too common");
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
    }, []);

    const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
        <li
            className={`flex items-center space-x-2 text-xs ${met ? "text-green-600" : "text-gray-500"}`}
        >
            {met ? (
                <CheckCircle className="h-4 w-4 text-white fill-green-600" />
            ) : (
                <XCircle className="h-4 w-4 text-white fill-gray-400" />
            )}
            <span>{text}</span>
        </li>
    );

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            {!hasAvailableCode ? (
                <form
                    onSubmit={handleSubmit(onSubmit, onError)}
                    className="bg-white w-[90%] max-w-lg p-8 rounded-3xl shadow-md border border-gray-300 max-h-[90vh] overflow-y-auto"
                >
                    {/* Title */}
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                        {title}
                    </h2>

                    {/* Inputs */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <span className="text-warning-content text-sm">
                                {errors.currentPassword?.message}
                            </span>
                            <div className="relative">
                                <input
                                    {...register("currentPassword")}
                                    type={showCurrent ? "text" : "password"}
                                    placeholder="Current Password"
                                    className={`w-full px-4 py-4 border rounded-xl text-gray-600 text-base focus:ring-2 outline-none pr-10 ${
                                        errors.currentPassword
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-400 focus:ring-secondary"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                                >
                                    {showCurrent ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            {errors.newPassword?.message &&
                                ![
                                    "Password is too common",
                                    "Password cannot contain your username",
                                ].includes(errors.newPassword.message) && (
                                    <span className="text-warning-content text-sm">
                                        {errors.newPassword.message}
                                    </span>
                                )}
                            <div className="relative">
                                <input
                                    {...register("newPassword")}
                                    type={showNew ? "text" : "password"}
                                    placeholder="New Password"
                                    className={`w-full px-4 py-4 border rounded-xl text-gray-600 text-base focus:ring-2 outline-none pr-10 ${
                                        errors.newPassword
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-400 focus:ring-secondary"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                                >
                                    {showNew ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Strength Meter */}
                            {newPassword && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-medium text-gray-600">
                                            Strength
                                        </span>
                                        <span
                                            className={`font-bold ${
                                                strength === "very-weak"
                                                    ? "text-red-600"
                                                    : strength === "weak"
                                                      ? "text-red-400"
                                                      : strength === "medium"
                                                        ? "text-yellow-500"
                                                        : "text-green-500"
                                            }`}
                                        >
                                            {getStrengthText(strength)} (
                                            {percentage}%)
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${getStrengthColor(strength)}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Requirements Checklist */}
                            {newPassword && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-xs font-semibold mb-2 text-gray-700">
                                        Password Requirements:
                                    </p>
                                    <ul className="space-y-1">
                                        <RequirementItem
                                            met={criteria.minLength}
                                            text="At least 8 characters"
                                        />
                                        <RequirementItem
                                            met={criteria.hasNumber}
                                            text="At least 1 number (e.g. 0-9)"
                                        />
                                        <RequirementItem
                                            met={criteria.hasUpper}
                                            text="At least 1 uppercase letter (e.g. A-Z)"
                                        />
                                        <RequirementItem
                                            met={criteria.hasSpecial}
                                            text="At least 1 special character (e.g. !@#$%^&*)"
                                        />
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <span className="text-warning-content text-sm">
                                {errors.confirmNewPassword?.message}
                            </span>
                            <div className="relative">
                                <input
                                    {...register("confirmNewPassword")}
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    className={`w-full px-4 py-4 border rounded-xl text-gray-600 text-base focus:ring-2 outline-none pr-10 ${
                                        errors.confirmNewPassword
                                            ? "border-red-500 focus:ring-red-200"
                                            : "border-gray-400 focus:ring-secondary"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                                >
                                    {showConfirm ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <span className="text-warning-content text-sm block mt-2">
                        {errors.root?.message}
                    </span>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-8">
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 py-3 rounded-xl font-medium text-lg"
                        >
                            {isSubmitting ? "trying..." : "Change Password"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-base-300 flex-1 py-3 rounded-xl font-medium text-lg"
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
                            className="w-full px-4 py-4 border border-gray-400 rounded-xl text-neutral focus:ring-2 focus:ring-secondary outline-none"
                        />
                    </div>
                    <div className="text-warning-content mt-2">{codeError}</div>
                    <div className="flex gap-4 mt-8">
                        <button
                            type="submit"
                            className="btn btn-primary flex-1 py-3 rounded-xl font-medium text-lg"
                        >
                            {verifying ? "verifying..." : "Verify"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-base-300 flex-1 py-3 rounded-xl font-medium text-lg"
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
