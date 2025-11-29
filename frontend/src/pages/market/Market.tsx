import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketCard from "@/features/market/MarketCard";
import CreateListingModal from "@/features/market/CreateListingModal";
import loading_gif from "@/assets/loading_gif.gif";

function Market() {
    const navigate = useNavigate();
    const [loading] = useState(false);
    const [search, setSearch] = useState("");

    const marketItems = [
        {
            uuid: "1",
            image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=300&h=300&fit=crop",
            title: "Golden Barrel Cactus",
            price: "200.00",
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam neque quam, varius id id enim vitae, efficitur feugiat lorem. Duis lobortis augue quam, sit amet rutrum mauris faucibus vel. Nullam sed ante eget ex gravida, commodo a quis tellus. Maecenas et erat ultricies, sodales ante eget, congue purus. Etiam maximus lacus ac cursus egestas.",
            seller: {
                username: "zjann_henry",
                display_name: "Zjann Henry Cuajotor",
                pfp_url: null,
            },
        },
        {
            uuid: "2",
            image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=300&h=300&fit=crop",
            title: "Monstera Deliciosa",
            price: "150.00",
        },
    ];

    return (
        <div className="bg-base-200 pr-1">
            {/* top controls */}
            <div className="bg-base-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold">Marketplace</h1>
                        <div className="flex gap-2">
                            <button className="btn btn-ghost">
                                Check your listing
                            </button>
                            <CreateListingModal />
                        </div>
                    </div>

                    <div className="w-full sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search plants..."
                            className="input input-bordered w-full bg-white border-gray-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* marketplace grid */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <img
                            src={loading_gif}
                            alt="Loading..."
                            className="h-16 w-16"
                        />
                    </div>
                ) : marketItems.length === 0 ? (
                    <p className="text-center text-neutral-400">
                        No items available.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {marketItems.map((item) => (
                            <MarketCard
                                key={item.uuid}
                                image={item.image}
                                title={item.title}
                                price={item.price}
                                onClick={() => navigate(`/market/${item.uuid}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="h-16" />
        </div>
    );
}

export default Market;
