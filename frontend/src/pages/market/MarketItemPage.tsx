import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ProfilePicture from "@/components/ProfilePicture";

export default function MarketItemPage() {
    const navigate = useNavigate();
    const { item_uuid } = useParams<{ item_uuid: string }>();

    const item = {
        uuid: item_uuid,
        image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&h=600&fit=crop",
        title: "Golden barrel cactus",
        price: "200.00",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam neque quam, varius id id enim vitae, efficitur feugiat lorem. Duis lobortis augue quam, sit amet rutrum mauris faucibus vel. Nullam sed ante eget ex gravida, commodo a quis tellus. Maecenas et erat ultricies, sodales ante eget, congue purus. Etiam maximus lacus ac cursus egestas.",
        seller: {
            username: "iligan_city_lanao",
            display_name: "Zjann Henry Cuajotor",
            pfp_url: null,
        },
    };

    const relatedItems = [
        {
            uuid: "r1",
            image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=300&h=300&fit=crop",
            title: "Echinocactus grusonii",
            price: "200.00",
        },
        {
            uuid: "r2",
            image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=300&h=300&fit=crop",
            title: "Echinocactus grusonii",
            price: "200.00",
        },
        {
            uuid: "r3",
            image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=300&h=300&fit=crop",
            title: "Echinocactus grusonii",
            price: "200.00",
        },
    ];

    return (
        <div className="bg-base-200 min-h-screen">
            <div className="bg-base-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered w-full sm:max-w-md bg-base-200"
                        />
                        <div className="flex gap-2">
                            <button className="btn btn-ghost">
                                Check your listing
                            </button>
                            <button className="btn btn-success">
                                Create Listing
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/market/")}
                        className="flex items-center gap-2 text-base-content hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Go Back</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-base-100 rounded-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                        <div className="relative w-full">
                            <div className="rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-base-content">
                                    {item.title}
                                </h1>
                                <div className="badge badge-success mt-2">
                                    Active
                                </div>
                            </div>

                            <div className="text-4xl font-bold text-success">
                                ₱{item.price}
                            </div>

                            <div>
                                <h2 className="font-semibold text-lg text-base-content mb-2">
                                    Description
                                </h2>
                                <p className="text-base-content/70 whitespace-pre-line leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            <div className="border-t pt-4 mt-auto">
                                <h2 className="font-semibold text-lg text-base-content mb-3">
                                    Seller Information
                                </h2>
                                <div className="flex items-center gap-3">
                                    <ProfilePicture src={item.seller.pfp_url} />
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {item.seller.display_name}
                                        </p>
                                        <p className="text-sm text-base-content/70">
                                            {item.seller.username}
                                        </p>
                                    </div>
                                    <button className="btn btn-success">
                                        Have a chat with the owner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* you may also like */}
                    <div className="border-t bg-base-200 px-6 py-6">
                        <h2 className="text-xl font-semibold mb-4">
                            You may also like
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {relatedItems.map((relatedItem) => (
                                <div
                                    key={relatedItem.uuid}
                                    className="cursor-pointer group"
                                    onClick={() =>
                                        navigate(`/market/${relatedItem.uuid}`)
                                    }
                                >
                                    <div className="rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm">
                                        <img
                                            src={relatedItem.image}
                                            alt={relatedItem.title}
                                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="mt-2 px-1">
                                        <p className="text-sm font-medium truncate">
                                            {relatedItem.title}
                                        </p>
                                        <p className="text-sm font-bold text-success">
                                            ₱{relatedItem.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-16" />
        </div>
    );
}
