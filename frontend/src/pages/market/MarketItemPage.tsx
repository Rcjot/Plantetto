import { useState, useEffect } from "react";
// Add Link to the imports
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, MessageCircle } from "lucide-react";
import ProfilePicture from "@/components/ProfilePicture";
import profileApi from "@/api/profileApi";
import plantsApi from "@/api/plantsApi";
import marketApi from "@/api/marketApi";
import RelatedItems from "@/features/market/RelatedItems";
import type { MarketItemType } from "@/features/market/marketTypes";
import type { UserType } from "@/features/auth/authTypes";
import loading_gif from "@/assets/loading_gif.gif";
import { useAuthContext } from "@/features/auth/AuthContext";

export default function MarketItemPage() {
    const navigate = useNavigate();
    const { item_uuid } = useParams<{ item_uuid: string }>();
    const { auth } = useAuthContext()!;

    const [item, setItem] = useState<MarketItemType | null>(null);
    const [seller, setSeller] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const isOwner = seller?.id === auth.user?.id;
    const onMarketPage = window.location.pathname.startsWith("/market");

    const getBackPath = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes("/mylistings/")) {
            return "/mylistings";
        }
        return "/market";
    };

    useEffect(() => {
        async function fetchMarketItem() {
            if (!item_uuid) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(false);

                const marketRes = await marketApi.getMarketItem(item_uuid);

                if (!marketRes.ok || !marketRes.marketItem) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setItem(marketRes.marketItem);

                if (marketRes.marketItem.plant?.plant_uuid) {
                    const plantRes = await plantsApi.fetchPlant(
                        marketRes.marketItem.plant.plant_uuid
                    );

                    if (plantRes.ok && plantRes.plant?.owner?.username) {
                        const sellerRes = await profileApi.fetchProfileDetails(
                            plantRes.plant.owner.username
                        );
                        if (sellerRes.user) {
                            setSeller(sellerRes.user);
                        }
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error("[MarketItemPage] Error fetching item:", err);
                setError(true);
                setLoading(false);
            }
        }

        fetchMarketItem();
    }, [item_uuid]);

    const handleChatWithSeller = () => {
        if (!seller) return;

        const event = new CustomEvent("openChat", {
            detail: { user: seller },
        });
        window.dispatchEvent(event);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <img src={loading_gif} alt="Loading..." className="h-16 w-16" />
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="bg-base-200 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate(getBackPath())}
                        className="flex items-center gap-2 text-base-content hover:text-primary transition-colors mb-4"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Go Back</span>
                    </button>
                    <div className="bg-base-100 rounded-lg p-8 text-center">
                        <p className="text-neutral-400">
                            Item not found. Redirecting to marketplace...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-200 min-h-screen">
            <div className="bg-base-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div className="flex gap-2 w-full sm:w-auto ml-auto ">
                            {onMarketPage ? (
                                <button
                                    className="btn btn-ghost btn-sm sm:btn-md flex-1 sm:flex-initial"
                                    onClick={() => navigate("/mylistings")}
                                >
                                    <span className="hidden sm:inline">
                                        Check your listing
                                    </span>
                                    <span className="sm:hidden">
                                        My Listings
                                    </span>
                                </button>
                            ) : (
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => navigate("/market")}
                                >
                                    Browse Marketplace
                                </button>
                            )}

                            <button
                                className="btn btn-success btn-sm sm:btn-md flex-1 sm:flex-initial ml-auto"
                                onClick={() => navigate("/mylistings")}
                            >
                                Create Listing
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(getBackPath())}
                        className="flex items-center gap-2 text-base-content hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium">Go Back</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                <div className="bg-base-100 rounded-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
                        <div className="relative w-full bg-gray-200 overflow-hidden rounded-lg min-h-[300px] lg:min-h-[500px]">
                            <div
                                className="absolute inset-0 bg-center bg-cover blur-lg scale-110 brightness-50"
                                style={{
                                    backgroundImage: `url(${item.plant.picture_url})`,
                                }}
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <img
                                src={item.plant.picture_url}
                                alt={item.plant.nickname}
                                className="relative z-10 object-contain w-full h-full"
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-base-content">
                                    {item.plant.nickname}
                                </h1>
                                <div
                                    className={`badge mt-2 ${
                                        item.status === "active"
                                            ? "badge-success"
                                            : "badge-warning"
                                    }`}
                                >
                                    {item.status === "active"
                                        ? "Active"
                                        : "Sold"}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 font-medium">
                                    Plant Type
                                </p>
                                <p className="text-base md:text-lg">
                                    {item.plant.plant_type}
                                </p>
                            </div>

                            <div className="text-3xl md:text-4xl font-bold text-success">
                                ₱{item.price}
                            </div>

                            <div>
                                <h2 className="font-semibold text-lg text-base-content mb-2">
                                    Description
                                </h2>
                                <p className="text-base-content/70 whitespace-pre-line leading-relaxed text-sm md:text-base">
                                    {item.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            {item.plant.description && (
                                <div>
                                    <h2 className="font-semibold text-lg text-base-content mb-2">
                                        Plant Details
                                    </h2>
                                    <p className="text-base-content/70 whitespace-pre-line leading-relaxed text-sm md:text-base">
                                        {item.plant.description}
                                    </p>
                                </div>
                            )}

                            {/* Seller Info */}
                            <div className="border-t pt-4 mt-auto">
                                <h2 className="font-semibold text-lg text-base-content mb-3">
                                    Seller Information
                                </h2>
                                {seller ? (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <Link to={`/${seller.username}`}>
                                                <ProfilePicture
                                                    src={seller.pfp_url}
                                                />
                                            </Link>
                                            <div className="flex flex-col">
                                                <Link
                                                    to={`/${seller.username}`}
                                                    className="hover:underline"
                                                >
                                                    <p className="font-semibold">
                                                        {seller.display_name ||
                                                            seller.username}
                                                    </p>
                                                </Link>
                                                <Link
                                                    to={`/${seller.username}`}
                                                    className="hover:underline"
                                                >
                                                    <p className="text-sm text-base-content/70">
                                                        @{seller.username}
                                                    </p>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            {!isOwner && (
                                                <button
                                                    className="btn btn-primary btn-sm gap-2 flex-1 sm:flex-initial"
                                                    onClick={
                                                        handleChatWithSeller
                                                    }
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="hidden sm:inline">
                                                        Chat with Seller
                                                    </span>
                                                    <span className="sm:hidden">
                                                        Chat
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="skeleton h-12 w-12 rounded-full shrink-0"></div>
                                        <div className="flex flex-col gap-2 flex-1">
                                            <div className="skeleton h-4 w-32"></div>
                                            <div className="skeleton h-3 w-24"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {!window.location.pathname.startsWith("/mylistings") && (
                    <div className="mt-6">
                        <RelatedItems marketItemUuid={item_uuid!} />
                    </div>
                )}
            </div>

            <div className="h-16" />
        </div>
    );
}
