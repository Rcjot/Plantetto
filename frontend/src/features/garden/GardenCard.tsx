import { Link } from "react-router-dom";
import market from "@/assets/icons/marketplace.svg";

interface GardenCardProps {
    forSale?: boolean;
    image: string;
    itemUuid?: string;
    title: string;
    onClick?: () => void;
}

export default function GardenCard({
    image,
    title,
    onClick,
    forSale,
    itemUuid,
}: GardenCardProps) {
    return (
        <div
            onClick={onClick}
            className="max-w-xs w-full cursor-pointer group relative"
        >
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <div className="w-[300px] h-[300px] overflow-hidden rounded-xl shadow-sm group-hover:shadow-md">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>

            {forSale && (
                <Link
                    to={`/market/${itemUuid}`}
                    className="btn btn-circle bg-warning border border-white border-4  absolute top-2 right-2 hover:scale-105"
                >
                    <img src={market} alt="Marketplace" className="w-5 h-5" />
                </Link>
            )}
            {/* text outside */}
            <div className="mt-2 rounded-b-xl px-3 py-3">
                <div className="text-sm font-medium text-gray-800 text-center truncate">
                    {title}
                </div>
            </div>
        </div>
    );
}
