import { useState } from "react";
import GardenCard from "../../features/garden/GardenCard.tsx";
import GardenAddPlant from "../../features/garden/GardenAddPlant.tsx";

function MyGarden() {
    const plants = [
        {
            id: 1,
            image: "https://placehold.co/400x400/228B22/white?text=Bonsai+1",
            title: "bonsai 3",
        },
        {
            id: 2,
            image: "https://placehold.co/400x400/90EE90/white?text=Snake+Plant",
            title: "my snake plant",
        },
        {
            id: 3,
            image: "https://placehold.co/400x400/FF69B4/white?text=Stock+Flower",
            title: "my stock flower",
        },
        {
            id: 4,
            image: "https://placehold.co/400x400/228B22/white?text=Bonsai+2",
            title: "bonsai 2",
        },
        {
            id: 5,
            image: "https://placehold.co/400x400/90EE90/white?text=Plant+5",
            title: "plant 5",
        },
        {
            id: 6,
            image: "https://placehold.co/400x400/FF69B4/white?text=Plant+6",
            title: "plant 6",
        },
    ];

    const [selectedCategory, setSelectedCategory] = useState("All");
    const categories = [
        "All",
        "Cacti",
        "Succulent",
        "Ficus",
        "Herbs",
        "Bonsai",
        "Ferns",
        "Exotic",
        "Flowering",
    ];

    return (
        <div className="bg-base-200 h-full flex flex-col">
            <div className="bg-base-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <GardenAddPlant />

                    {/* search, no function yet */}
                    <div className="relative mb-4 mt-4">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-full bg-white pl-10"
                        />
                    </div>

                    {/* filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`btn btn-sm flex-shrink-0 ${
                                    selectedCategory === category
                                        ? "btn-success"
                                        : "btn-ghost bg-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* garden grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {plants.map((plant) => (
                            <GardenCard
                                key={plant.id}
                                image={plant.image}
                                title={plant.title}
                                onClick={() =>
                                    console.log(
                                        "clicked dis shet:",
                                        plant.title
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MyGarden;
