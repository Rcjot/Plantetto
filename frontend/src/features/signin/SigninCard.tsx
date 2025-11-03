import SigninForm from "./SigninForm";
import { Link } from "react-router-dom";
function SigninCard() {
    return (
        <>
            <fieldset
                className={`fieldset max-w-[376px] bg-base-100 border-base-300 rounded-box w-base border px-7 py-5 sm:px-15 sm:py-10 flex flex-col gap-5 shadow-2xl`}
            >
                <h1 className="text-2xl font-bold text-center">
                    Welcome to Plantetto!
                </h1>
                <SigninForm />
                <p className="self-center">
                    New to the garden? &nbsp;
                    <Link className="font-extrabold underline " to={"/signup"}>
                        Create an Account
                    </Link>
                </p>
                <p className="self-center italic">
                    because <span className="font-extrabold">every plant</span>{" "}
                    deserves a <span className="font-extrabold">story</span>
                </p>
            </fieldset>
        </>
    );
}

export default SigninCard;