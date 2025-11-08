import { MarketTopCard } from "./lndpg-market-topcard.tsx";
import { MarketSmallCard } from "./lndpg-market-smallcard.tsx";
import waterLily from "@/assets/LandingPage/MarketImages/Water Lily.webp";
import dumbCane from "@/assets/LandingPage/MarketImages/Dumb Cane.webp";
import cannabis from "@/assets/LandingPage/MarketImages/cannabis plant.webp";
import windowAloe from "@/assets/LandingPage/MarketImages/Haworthia mutica.webp";
import starCactus from "@/assets/LandingPage/MarketImages/Haworthia retusa.webp";
import tounge from "@/assets/LandingPage/MarketImages/Mother-in-Law's Tongue.webp";
import moonStone from "@/assets/LandingPage/MarketImages/Pachyphytum oviferum.webp";
import sanPedro from "@/assets/LandingPage/MarketImages/Trichocereus cactus.webp";

export function MarketBottomCard() {
    return (
        <div className="w-[650px] h-[585px] flex justify-center items-center bg-[#D25B2C] rounded-[10px]">
            <div className="flex flex-col gap-y-[8px]">
                <MarketTopCard />

                <div className="grid grid-cols-4 gap-[8px]">
                    <MarketSmallCard
                        image={waterLily}
                        name="Water Lily"
                        caption="none"
                        price="P230.00"
                    />
                    <MarketSmallCard
                        image={dumbCane}
                        name="Dumb Cane"
                        caption="none"
                        price="P230.00"
                    />
                    <MarketSmallCard
                        image={cannabis}
                        name="Cannabis"
                        caption="none"
                        price="P230.00"
                    />
                    <MarketSmallCard
                        image={windowAloe}
                        name="Window Aloe"
                        caption="none"
                        price="P230.00"
                    />
                    <MarketSmallCard
                        image={starCactus}
                        name="Star Cactus"
                        caption="none"
                        price="P230.00"
                    />
                    <MarketSmallCard
                        image={tounge}
                        name="Mother-in-Law's Tongue"
                        caption="none"
                        price="P230.00"
                    />
                    <MarketSmallCard
                        image={moonStone}
                        name="Moonstone"
                        caption="none"
                        price="P230.00"
                    />
                    <MarketSmallCard
                        image={sanPedro}
                        name="San Pedro Cactus"
                        caption="none"
                        price="P230.00"
                    />
                </div>
            </div>
        </div>
    );
}
