import { useState } from "react";
import GardenCard from "../../features/garden/GardenCard.tsx";
import GardenAddPlant from "../../features/garden/GardenAddPlant.tsx";
import GardenCard_Details from "../../features/garden/GardenCard_Details.tsx";
import plant_thing from "@/assets/plant_thing.png";
import image from "@/assets/image.png";

function MyGarden() {
    //change to API fetching later on
    const plants = [
        {
            id: 1,
            image: plant_thing,
            title: "Bonsai 3",
            type: "Bonsai",
            description: "A small, well-shaped bonsai tree.",
        },
        {
            id: 2,
            image: image,
            title: "My Snake Plant",
            type: "Succulent",
            description: "Low maintenance plant perfect for indoors.",
        },
        {
            id: 3,
            image: plant_thing,
            title: "Ficus Lyrata",
            type: "Ficus",
            description: "A large indoor plant with broad leaves.",
        },
        {
            id: 4,
            image: image,
            title: "Aloe Vera",
            type: "Succulent",
            description: "Medicinal plant, easy to care for.",
        },
        {
            id: 5,
            image: plant_thing,
            title: "Mini Cactus",
            type: "Cacti",
            description: "Small cactus, perfect for desktops.",
        },
        {
            id: 6,
            image: image,
            title: "Herb Garden",
            type: "Herbs",
            description: "Various herbs you can grow indoors.",
        },
        {
            id: 7,
            image: plant_thing,
            title: "Exotic Fern",
            type: "Ferns",
            description: "Tropical fern for humid areas.",
        },
        {
            id: 8,
            image: image,
            title: "Flowering Plant",
            type: "Flowering",
            description: "Adds color to your garden.",
        },
        {
            id: 9,
            image: plant_thing,
            title: "Bonsai 4",
            type: "Bonsai",
            description: "Another bonsai example for the collection.",
        },
        {
            id: 10,
            image: image,
            title: "Succulent Mix",
            type: "Succulent",
            description: "Multiple succulents arranged in a pot.",
        },
    ];

    const [selectedPlant, setSelectedPlant] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const handleCardClick = (plant: any) => {
        setSelectedPlant(plant);
        setOpen(true);
    };

    //change to API stuff later
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
        <div className="bg-base-200 h-screen overflow-y-auto">
            <div className="bg-base-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
                    {/* add plant */}
                    <div className="w-full sm:w-auto">
                        <GardenAddPlant />
                    </div>

                    {/* search, no function yet */}
                    <div className="w-full sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered w-full bg-white border-gray-200"
                        />
                    </div>

                    {/* filter */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
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
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {plants.map((plant) => (
                        <GardenCard
                            key={plant.id}
                            image={plant.image}
                            title={plant.title}
                            onClick={() => handleCardClick(plant)}
                        />
                    ))}
                </div>
            </div>

            {/* dialog */}
            {selectedPlant && (
                <GardenCard_Details
                    open={open}
                    onOpenChange={setOpen}
                    image={selectedPlant.image}
                    title={selectedPlant.title}
                    type={selectedPlant.type}
                    description={selectedPlant.description}
                />
            )}
        </div>
    );
}
export default MyGarden;
