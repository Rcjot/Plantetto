import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ProfilePicture from "@/components/ProfilePicture";
import profileApi from "@/api/profileApi";
import plantsApi from "@/api/plantsApi";
import type { MarketItemType } from "@/features/market/marketTypes";
import type { UserType } from "@/features/auth/authTypes";
import loading_gif from "@/assets/loading_gif.gif";

export default function MarketItemPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [item, _setItem] = useState<MarketItemType | null>(
        location.state?.item || null
    );
    const [seller, setSeller] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(!location.state?.item);
    const isOwner = location.state?.isOwner || false;

    useEffect(() => {
        if (!location.state?.item) {
            setLoading(false);
            const timer = setTimeout(() => {
                navigate("/market", { replace: true });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [location.state, navigate]);

    useEffect(() => {
        async function fetchPlantAndSeller() {
            if (!item?.plant?.plant_uuid) {
                console.log("[MarketItemPage] No plant_uuid available");
                return;
            }

            try {
                const plantRes = await plantsApi.fetchPlant(
                    item.plant.plant_uuid
                );

                if (plantRes.ok && plantRes.plant?.owner?.username) {
                    const sellerRes = await profileApi.fetchProfileDetails(
                        plantRes.plant.owner.username
                    );
                    if (sellerRes.user) {
                        setSeller(sellerRes.user);
                    }
                } else {
                    console.log(
                        "[MarketItemPage] Could not get plant owner info"
                    );
                }
            } catch (error) {
                console.error("[MarketItemPage] Error fetching seller:", error);
            }
        }

        fetchPlantAndSeller();
    }, [item]);

    const relatedItems = [
        {
            uuid: "r1",
            image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=300&h=300&fit=crop",
            title: "Golden Barrel Cactus",
            price: "200.00",
        },
        {
            uuid: "r2",
            image: "https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=300&h=300&fit=crop",
            title: "Snake Plant",
            price: "150.00",
        },
        {
            uuid: "r3",
            image: "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=300&h=300&fit=crop",
            title: "Monstera Deliciosa",
            price: "350.00",
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <img src={loading_gif} alt="Loading..." className="h-16 w-16" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="bg-base-200 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <button
                        onClick={() => navigate("/market")}
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
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered w-full sm:max-w-md bg-base-200"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/market");
                            }}
                            readOnly
                        />
                        <div className="flex gap-2">
                            <button
                                className="btn btn-ghost"
                                onClick={() => navigate("/mylistings")}
                            >
                                Check your listing
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={() => navigate("/mylistings")}
                            >
                                Create Listing
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
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
                        <div className="relative w-full h-full bg-gray-200 overflow-hidden rounded-lg">
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
                                <h1 className="text-3xl font-bold text-base-content">
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
                                <p className="text-lg">
                                    {item.plant.plant_type}
                                </p>
                            </div>

                            <div className="text-4xl font-bold text-success">
                                ₱{item.price}
                            </div>

                            <div>
                                <h2 className="font-semibold text-lg text-base-content mb-2">
                                    Description
                                </h2>
                                <p className="text-base-content/70 whitespace-pre-line leading-relaxed">
                                    {item.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            {item.plant.description && (
                                <div>
                                    <h2 className="font-semibold text-lg text-base-content mb-2">
                                        Plant Details
                                    </h2>
                                    <p className="text-base-content/70 whitespace-pre-line leading-relaxed">
                                        {item.plant.description}
                                    </p>
                                </div>
                            )}

                            <div className="border-t pt-4 mt-auto">
                                <h2 className="font-semibold text-lg text-base-content mb-3">
                                    Seller Information
                                </h2>
                                {seller ? (
                                    <div className="flex items-center gap-3">
                                        <ProfilePicture src={seller.pfp_url} />
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {seller.display_name ||
                                                    seller.username}
                                            </p>
                                            <p className="text-sm text-base-content/70">
                                                @{seller.username}
                                            </p>
                                        </div>
                                        <button
                                            className="btn btn-success"
                                            onClick={() =>
                                                navigate(`/${seller.username}`)
                                            }
                                        >
                                            View Profile
                                        </button>
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

                    {/* you may also like (not show in my listing) */}
                    {!isOwner && (
                        <div className="border-t bg-base-200 px-6 py-6">
                            <h2 className="text-xl font-semibold mb-4">
                                You may also like
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {relatedItems.map((relatedItem) => (
                                    <div
                                        key={relatedItem.uuid}
                                        className="cursor-pointer group"
                                        onClick={() => navigate("/market")}
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
                    )}
                </div>
            </div>

            <div className="h-16" />
        </div>
    );
}
