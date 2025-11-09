import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import authApi from "@/api/authApi";
import { useAuthContext } from "../auth/AuthContext";

const schema = z.object({
    username: z.string().nonempty("required"),
    password: z.string().nonempty("required"),
});

export type SigninFields = z.infer<typeof schema>;
type SigninFieldNames = keyof SigninFields;

function SiginForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SigninFields>({
        // defaultValues: { username: "user0" },
        resolver: zodResolver(schema),
    });
    const { signin } = useAuthContext()!;

    const onSubmit: SubmitHandler<SigninFields> = async (data) => {
        await authApi.fetchMe();
        const res = await authApi.signinUser(data);
        if (!res.ok) {
            (
                Object.entries(res.errors) as [SigninFieldNames, string[]][]
            ).forEach(([field, messages]) => {
                setError(field, { message: messages[0] });
            });
        } else {
            signin(res.auth);
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
                    autoComplete="username"
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
                    autoComplete="current-password"
                />
            </div>
            <span className="text-warning-content">{errors.root?.message}</span>

            <button className="btn btn-neutral mt-4 self-center px-10">
                {isSubmitting ? "signing in.." : "sign in"}
            </button>
        </form>
    );
}

export default SiginForm;
