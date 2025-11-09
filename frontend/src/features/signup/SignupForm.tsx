import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import authApi from "@/api/authApi";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    username: z.string().nonempty("required"),
    email: z.email("invalid email!").nonempty("required"),
    password: z.string().min(8, "too short!").nonempty("required"),
    confirm: z.string().nonempty("required"),
});

export type SignupFields = z.infer<typeof schema>;
type SignupFieldNames = keyof SignupFields;

function SignupForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignupFields>({
        // defaultValues: { username: "user0" },
        resolver: zodResolver(schema),
    });
    const navigate = useNavigate();
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
            navigate("/signin");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
                    className="input"
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
                    className="input"
                    autoComplete="email"
                />
            </div>

            <label htmlFor="password" className="label">
                Password
            </label>
            <div>
                <span className="text-warning-content">
                    {errors.password?.message}
                </span>
                <input
                    {...register("password")}
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input"
                    autoComplete="new-password"
                />
            </div>

            <label htmlFor="confirm" className="label">
                Confirm Password
            </label>
            <div>
                <span className="text-warning-content">
                    {errors.confirm?.message}
                </span>
                <input
                    {...register("confirm")}
                    type="password"
                    name="confirm"
                    placeholder="Confirm Password"
                    className="input"
                    autoComplete="new-password"
                />
            </div>

            <button className="btn btn-neutral mt-4 self-center px-10">
                {isSubmitting ? "signing up.." : "sign up"}
            </button>
            <span className="text-warning-content">{errors.root?.message}</span>
        </form>
    );
}

export default SignupForm;
