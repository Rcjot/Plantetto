import SignupCard from "@/features/signup/SignupCard";
import SignupImage from "@/assets/SignupImage.png";

function Signup() {
    return (
        <main className="bg-neutral min-h-full w-screen flex flex-col xl:flex-row justify-around xl:justify-center xl:gap-35 p-10 items-center">
            <img src={SignupImage} alt="plantetto images" />
            <SignupCard />
        </main>
    );
}

export default Signup;