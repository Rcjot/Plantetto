import SignupForm from "./SignupForm";
import { Link } from "react-router-dom";
function SignupCard() {
    return (
        <>
            <fieldset
                className={`fieldset max-w-[376px] bg-base-100 border-base-300 rounded-box w-base border px-7 py-5 sm:px-15 sm:py-10 flex flex-col gap-5 shadow-2xl`}
            >
                <h1 className="text-2xl font-bold text-center">
                    Welcome to Plantetto!
                </h1>
                <SignupForm />
                <p className="self-center">
                    Already got an account? &nbsp;
                    <Link className="font-extrabold underline " to={"/signin"}>
                        Sign in
                    </Link>
                </p>
            </fieldset>
        </>
    );
}

export default SignupCard;