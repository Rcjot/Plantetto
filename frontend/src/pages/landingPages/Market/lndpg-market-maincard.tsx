import { MarketTopCard } from "./lndpg-market-topcard";
import { MarketBottomCard } from "./lndpg-market-bottomcard";


export function MarketMainCard() {
    return(
        <div>
            <div className="relative flex flex-row items-center">
                <div className="absolute w-[604px] skew-x-9 z-10 top-0 drop-shadow-[-7px_15px_22px_rgba(0,0,0,0.75)] ml-10">
                    <MarketTopCard/></div>
                <div  className="relative top-10 w-[680px] skew-x-9 blur-[2px] z-0">
                    <MarketBottomCard/></div>
            </div>
        </div>
    );
}