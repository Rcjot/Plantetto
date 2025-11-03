import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    username: z.string().nonempty("required"),
    password: z.string().nonempty("required"),
});

export type SigninFields = z.infer<typeof schema>;

function SiginForm() {
    const {
        register,
        handleSubmit,
        // setError,
        formState: { errors, isSubmitting },
    } = useForm<SigninFields>({
        // defaultValues: { username: "user0" },
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<SigninFields> = async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <label htmlFor="username" className="label">
                Username
            </label>
            <div>
                <span className="text-warning">{errors.username?.message}</span>
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
                <span className="text-warning">{errors.password?.message}</span>
                <input
                    {...register("password")}
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input"
                    autoComplete="current-password"
                />
            </div>
            <span className="text-warning">{errors.root?.message}</span>

            <button className="btn btn-neutral mt-4 self-center px-10">
                {isSubmitting ? "signing in.." : "sign in"}
            </button>
        </form>
    );
}

export default SiginForm;