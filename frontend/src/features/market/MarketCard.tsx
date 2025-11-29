interface MarketCardProps {
    image: string;
    title: string;
    price: string;
    onClick?: () => void;
}

export default function MarketCard({
    image,
    title,
    price,
    onClick,
}: MarketCardProps) {
    return (
        <div onClick={onClick} className="max-w-xs w-full cursor-pointer group">
            <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                {/* image */}
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gray-300/70 backdrop-blur-sm px-3 py-3">
                    <div className="text-sm font-medium text-gray-800 truncate">
                        {title}
                    </div>
                    <div className="text-lg font-bold text-green-700 mt-1">
                        ₱{price}
                    </div>
                </div>
            </div>
        </div>
    );
}
