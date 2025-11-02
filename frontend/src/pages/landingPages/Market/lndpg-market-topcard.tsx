import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export function MarketTopCard() {
    return(
        <div className="flex flex-row gap-x-[8px]">
            <div>
                <img className="w-[298px] h-[258px] rounded-[8px]"
                    src="./src/assets/LandingPage/MarketImages/goldenbarrelcactus-topcard.webp"/>
            </div>

            <div>
                <Card className="w-[298px] h-[258px] rounded-[8px] bg-white">

                    <div className="flex flex-col mx-[10px] mt-[-10px]">
                        <p className="text-[18px]">Golden barrel cactus</p>
                        <Button className="text-[8px] w-[32px] h-[14px] rounded-[3px] bg-[#96C698]">#Cacti</Button>
                    </div>

                    <div className="my-[-10px]">
                        <p className="text-[14px] font-medium mx-[10px] text-[#D25B2C]">P300.00</p>
                    </div>

                    <div>
                        <p className="font-bold mx-[10px] mt-[-10px]">Description</p>
                        <p className="text-[9px] text-justify line-clamp-4 mx-[10px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam neque quam, varius id enim vitae, efficitur feugiat lorem. Duis lobortis augue quam, sit amet rutrum mauris faucibus vel. Nullam sed ante eget ex laoreet commodo a quis tellus. Maecenas et erat ultricies, sodales ante eget, congue purus. Etiam maximus lacus ac cursus egestas. Aenean in enim dignissim, iaculis erat id, porta quam.</p>
                    </div>

                    <div className="mx-[10px] flex flex-col mt-[-10px]">
                        <div>
                            <p className="text-[9px] mb-[5px] font-bold">Seller Information</p>
                        </div>

                        <div className="flex flex-row items-center gap-x-[4px] ">
                            <div className="w-[26px] h-[26px]">
                                <Avatar>
                                    <AvatarImage className="w=[26px] h-[26px]" src="./src/assets/LandingPage/MarketImages/Avatar1.png"/>
                                </Avatar>
                            </div>
                            <div className="flex flex-col text-[9px]">
                                <p className="font-bold">Zjann Henry Cuajotor</p>
                                <p>Iligan City, Lanao del Norte</p>
                            </div>
                            <div className="mx-[8px]">
                                <Button variant="outline" className=" text-[8px] font-bold w-[115px] h-[22px] rounded-[1.48px] border-[1px] border-black">Have a chat with the owner</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}