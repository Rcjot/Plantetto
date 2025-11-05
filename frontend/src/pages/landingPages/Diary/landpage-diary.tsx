import plantCard from "@/assets/LandingPage/DiaryImages/DiaryMainCard.svg";
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom";

export function LPDiary2() {
    return (
        <section className="bg-[#FFDFB1] flex justify-center items-center h-[701px] w-full">
            <div className="flex flex-row items-center gap-16">

                <div className="flex flex-col max-w-[450px] text-center text-[#5A3E2F]">
                    <h1 className="text-[40px] font-bold">
                        Keep a daily diary of your plants.
                    </h1>
                    <p className="text-[32px] opacity-80">
                        Track growth, add notes,
                        and celebrate milestones.
                    </p>
                    <div className="mt-[8px]">
                        <Button asChild className="w-[250px] h-[75px] text-[24px] text-[#FFDFB1] rounded-[30px] bg-[#5A3E2F]"
                        >
                            <Link to={"/signup"}
                            >
                                Join Plantetto
                            </Link>
                        </Button>
                    </div>
                </div>



                <div className="flex justify-center items-center select-none pointers-event-none">
                    <img
                        className="select-none pointer-events-none"
                        src={plantCard}
                    />
                </div>

            </div>
        </section>
    );
}
