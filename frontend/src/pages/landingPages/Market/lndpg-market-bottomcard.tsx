import { MarketTopCard } from "./lndpg-market-topcard.tsx"
import { MarketSmallCard } from "./lndpg-market-smallcard.tsx";

export function MarketBottomCard() {
    return (
        <div className="w-[650px] h-[585px] flex justify-center items-center bg-[#D25B2C] rounded-[10px]">
            
            <div className="flex flex-col gap-y-[8px]">
                <MarketTopCard />

                <div className="grid grid-cols-4 gap-[8px]">
                    <MarketSmallCard image="./src/assets/LandingPage/MarketImages/Water Lily.webp" name="Water Lily" caption="none" price="P230.00" />
                    <MarketSmallCard image="./src/assets/LandingPage/MarketImages/Dumb Cane.webp" name="Dumb Cane" caption="none" price="P230.00" />
                    <MarketSmallCard image="./src/assets/LandingPage/MarketImages/cannabis plant.webp" name="Cannabis" caption="none" price="P230.00" />
                    <MarketSmallCard image="./src/assets/LandingPage/MarketImages/Haworthia mutica.webp" name="Window Aloe" caption="none" price="P230.00" />
                    <MarketSmallCard image="./src/assets/LandingPage/MarketImages/Haworthia retusa.webp" name="Star Cactus" caption="none" price="P230.00" />
                    <MarketSmallCard image="./src/assets/LandingPage/MarketImages/Mother-in-Law's Tongue.webp" name="Mother-in-Law's Tongue" caption="none" price="P230.00" />
                    <MarketSmallCard image="./src/assets/LandingPage/MarketImages/Pachyphytum oviferum.webp" name="Moonstone" caption="none" price="P230.00" />
                    <MarketSmallCard image="./src/assets/LandingPage/MarketImages/Trichocereus cactus.webp" name="San Pedro Cactus" caption="none" price="P230.00" />
                </div>
            </div>
        </div>
    );
}

