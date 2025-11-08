import SignupCard from "@/features/signup/SignupCard";
import SignupImage from "@/assets/SignupImage.png";
import { NavBar } from "@/pages/landingPages/landpage-navbar";

function Signup() {
    return (
        <main className="bg-neutral min-h-full w-screen flex flex-col xl:flex-row justify-around xl:justify-center xl:gap-35 p-10 items-center">
            <NavBar active="hero" />
            <img src={SignupImage} alt="plantetto images" />
            <SignupCard />
        </main>
    );
}

export default Signup;