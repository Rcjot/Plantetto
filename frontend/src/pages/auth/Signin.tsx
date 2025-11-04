import SignupImage from "@/assets/SignupImage.png";
import SigninCard from "@/features/signin/SigninCard";

function Signin() {
    return (
        <main className="bg-neutral min-h-full w-screen flex flex-col xl:flex-row justify-around xl:justify-center xl:gap-35 p-10 items-center">
            <img src={SignupImage} alt="plantetto images" />
            <SigninCard />
        </main>
    );
}

export default Signin;