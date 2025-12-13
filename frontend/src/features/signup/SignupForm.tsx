import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { z } from "zod";
import authApi from "@/api/authApi";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { useState, useMemo } from "react";
import { usePasswordValidation } from "@/features/signup/usePasswordValidation";
import { toast } from "react-toastify";
import VerificationPopup from "./VerificationPopup";

const schema = z
    .object({
        username: z.string().nonempty("required"),
        email: z.email("invalid email!").nonempty("required"),
        password: z.string().nonempty("required"),
        confirm: z.string().nonempty("required"),
    })
    .superRefine((data, ctx) => {
        const password = data.password;

        if (password.length < 8)
            ctx.addIssue({
                code: "custom",
                message: "Password must be at least 8 characters long",
                path: ["password"],
            });
        if (!/[A-Z]/.test(password))
            ctx.addIssue({
                code: "custom",
                message:
                    "Must contain at least one uppercase letter (e.g. A-Z)",
                path: ["password"],
            });
        if (!/\d/.test(password))
            ctx.addIssue({
                code: "custom",
                message: "Must contain at least one number (e.g. 0-9)",
                path: ["password"],
            });
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/\\~`]/.test(password))
            ctx.addIssue({
                code: "custom",
                message:
                    "Must contain at least one special character (e.g. !@#$%^&*)",
                path: ["password"],
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
                path: ["password"],
            });
            // REMOVED: toast.info("Password is too common");
        }

        if (
            data.username &&
            data.username.length >= 3 &&
            password.toLowerCase().includes(data.username.toLowerCase())
        ) {
            ctx.addIssue({
                code: "custom",
                message: "Password cannot contain your username",
                path: ["password"],
            });
            // REMOVED: console.log and toast.info
        }

        if (password !== data.confirm) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirm"],
            });
        }
    });

export type SignupFields = z.infer<typeof schema>;
type SignupFieldNames = keyof SignupFields;

function SignupForm() {
    const { calculateStats, getStrengthColor, getStrengthText } =
        usePasswordValidation();

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignupFields>({
        // defaultValues: { username: "user0" }
        resolver: zodResolver(schema),
        mode: "onSubmit",
    });

    const [openVerification, setOpenVerification] = useState(false);
    const [hasAvailableCode, setHasAvailableCode] = useState(false);

    // REMOVED: useEffect that watched errors.password

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const password = watch("password", "");
    const email = watch("email", "");

    const { strength, percentage } = useMemo(
        () => calculateStats(password),
        [password]
    );

    const criteria = {
        minLength: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/\\~`]/.test(password),
    };

    const onSubmit: SubmitHandler<SignupFields> = async (data) => {
        await authApi.fetchMe();
        const res = await authApi.signupUser(data);
        if (!res.ok) {
            (
                Object.entries(res.errors) as [SignupFieldNames, string[]][]
            ).forEach(([field, messages]) => {
                setError(field, { message: messages[0] });
            });
        } else {
            const hasAvailableCode = res.hasAvailableCode;
            toast.success("sent verification code!");
            setHasAvailableCode(Boolean(hasAvailableCode));
            setOpenVerification(true);
        }
    };

    const onError: SubmitErrorHandler<SignupFields> = (errors) => {
        const msg = errors.password?.message;
        if (
            msg === "Password cannot contain your username" ||
            msg === "Password is too common"
        ) {
            toast.info(msg);
        }
    };

    const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
        <li
            className={`flex items-center space-x-2 text-xs ${met ? "text-green-600" : "text-gray-500"}`}
        >
            {met ? (
                <CheckCircle className="h-4 w-4" />
            ) : (
                <XCircle className="h-4 w-4" />
            )}
            <span>{text}</span>
        </li>
    );

    return (
        <>
            <VerificationPopup
                open={openVerification}
                setOpen={setOpenVerification}
                hasAvailableCode={hasAvailableCode}
                email={email}
            />
            <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="flex flex-col gap-2"
            >
                <label htmlFor="username" className="label">
                    Username
                </label>
                <div>
                    <span className="text-warning-content">
                        {errors.username?.message}
                    </span>
                    <input
                        {...register("username")}
                        type="text"
                        name="username"
                        placeholder="Username"
                        className={`input w-full ${errors.username ? "input-error" : ""}`}
                    />
                </div>

                <label htmlFor="email" className="label">
                    Email
                </label>
                <div>
                    <span className="text-warning-content">
                        {errors.email?.message}
                    </span>
                    <input
                        {...register("email")}
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={`input w-full ${errors.email ? "input-error" : ""}`}
                        autoComplete="email"
                    />
                </div>

                <label htmlFor="password" className="label">
                    Password
                </label>
                <div>
                    {errors.password?.message &&
                        ![
                            "Password cannot contain your username",
                            "Password is too common",
                        ].includes(errors.password.message) && (
                            <span className="text-warning-content"></span>
                        )}

                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            autoComplete="new-password"
                            className={`input w-full pr-10 ${errors.password ? "input-error" : ""}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {password && (
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
                                    {getStrengthText(strength)} ({percentage}%)
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

                    {password && (
                        <div className="mt-3 p-3 bg-base-200 rounded-lg border border-base-300">
                            <p className="text-xs font-semibold mb-2 opacity-70">
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

                <label htmlFor="confirm" className="label">
                    Confirm Password
                </label>
                <div>
                    <span className="text-warning-content">
                        {errors.confirm?.message}
                    </span>
                    <div className="relative">
                        <input
                            {...register("confirm")}
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            className={`input w-full pr-10 ${errors.confirm ? "input-error" : ""}`}
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

                <button className="btn btn-neutral mt-4 self-center px-10">
                    {isSubmitting ? "signing up.." : "sign up"}
                </button>
                <span className="text-warning-content">
                    {errors.root?.message}
                </span>
            </form>
        </>
    );
}

export default SignupForm;
