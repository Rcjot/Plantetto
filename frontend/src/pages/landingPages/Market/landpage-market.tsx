import { MarketTextPart } from "./lndpg-market-text";
import { MarketMainCard } from "./lndpg-market-maincard.tsx"

export function LPMarket() {
    return (
        <div className="bg-[#D25B2C]">

            <div className="flex flex-row w-full min-h-screen items-center justify-between">

                <div className="m-10">
                    <MarketMainCard/>
                </div>

                <div className="w-1/2 px-12">
                    <MarketTextPart/>
                </div>

            </div>

        </div>
    );
}
