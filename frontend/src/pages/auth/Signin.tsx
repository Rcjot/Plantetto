import SignupImage from "@/assets/SignupImage.png";
import SigninCard from "@/features/signin/SigninCard";
import { NavBar } from "@/pages/landingPages/landpage-navbar";

function Signin() {
    return (
        <main className="bg-[#444E36] min-h-full w-screen flex flex-col xl:flex-row justify-around xl:justify-center xl:gap-35 p-10 items-center">
            <NavBar active="hero" />
            <img src={SignupImage} alt="plantetto images" />
            <SigninCard />
        </main>
    );
}

export default Signin;

