interface GardenCardProps {
    image: string;
    title: string;
    onClick?: () => void;
}

export default function GardenCard({ image, title, onClick }: GardenCardProps) {
    return (
        <div onClick={onClick} className="max-w-xs w-full cursor-pointer group">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                <div className="w-full overflow-hidden rounded-xl shadow-sm group-hover:shadow-md">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                </div>
            </div>

            {/* text outside */}
            <div className="mt-2 rounded-b-xl px-3 py-3">
                <div className="text-sm font-medium text-gray-800 text-center truncate">
                    {title}
                </div>
            </div>
        </div>
    );
}
