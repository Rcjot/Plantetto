import { useEffect, useState } from "react";
import marketApi from "@/api/marketApi";
import type { MarketItemType } from "@/features/market/marketTypes";
import loading_gif from "@/assets/loading_gif.gif";

interface Props {
    marketItemUuid: string;
}

export default function RelatedItems({ marketItemUuid }: Props) {
    const [items, setItems] = useState<MarketItemType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRelated() {
            setLoading(true);
            const res = await marketApi.getRelatedItems(marketItemUuid);
            if (res.ok) setItems(res.items);
            setLoading(false);
        }

        if (marketItemUuid) fetchRelated();
    }, [marketItemUuid]);

    if (loading)
        return (
            <div className="w-full flex justify-center py-6">
                <img src={loading_gif} className="w-12 h-12 opacity-60" />
            </div>
        );

    if (!items.length) return <></>;

    return (
        <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">You may also like</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item) => (
                    <div
                        key={item.uuid}
                        className="bg-white rounded-xl shadow p-3 cursor-pointer hover:scale-[1.02] transition"
                        onClick={() =>
                            window.location.assign(`/market/${item.uuid}`)
                        }
                    >
                        <img
                            src={item.plant.picture_url}
                            className="w-full aspect-square rounded-lg object-cover mb-2"
                        />

                        <p className="font-semibold truncate">
                            {item.description}
                        </p>

                        <p className="text-green-700 font-bold">
                            ₱{item.price.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
