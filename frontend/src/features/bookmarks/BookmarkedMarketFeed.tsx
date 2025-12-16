import { useCallback, useEffect, useRef, useState } from "react";
import bookmarksApi from "@/api/bookmarksApi";
import type { MarketItemType } from "@/features/market/marketTypes";
import MarketCard from "@/features/market/MarketCard";
import { useNavigate } from "react-router-dom";

function BookmarkedMarketFeed() {
    const [items, setItems] = useState<MarketItemType[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const initialFetch = useRef(false);
    const infiniteTriggerRef = useRef<HTMLDivElement>(null);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        const { items: resItems, ok } =
            await bookmarksApi.fetchBookmarkedMarketItems(page);

        if (ok) {
            setItems((prev) => [...prev, ...resItems]);
            if (resItems.length < 12) {
                setHasMore(false);
            } else {
                setPage((prev) => prev + 1);
            }
        } else {
            setHasMore(false);
        }
        setLoading(false);
    }, [page]);

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        fetchItems();
    }, []);

    useEffect(() => {
        if (!infiniteTriggerRef.current) return;
        const observedRef = infiniteTriggerRef.current;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !loading && hasMore) {
                fetchItems();
            }
        });
        observer.observe(observedRef);
        return () => {
            if (observedRef) observer.unobserve(observedRef);
            observer.disconnect();
        };
    }, [loading, hasMore, fetchItems]);

    return (
        <div className="flex flex-col w-full pb-10">
            {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full justify-items-center">
                    {items.map((item) => (
                        <MarketCard
                            key={item.uuid}
                            uuid={item.uuid}
                            image={item.plant.picture_url}
                            title={item.plant.nickname}
                            price={item.price}
                            owner={item.owner}
                            status={item.status}
                            bookmarked={true}
                            onClick={() => navigate(`/market/${item.uuid}`)}
                        />
                    ))}
                </div>
            ) : (
                !loading && (
                    <div className="text-center text-gray-500 mt-10">
                        You haven't bookmarked any market items yet.
                    </div>
                )
            )}

            {hasMore && (
                <div
                    ref={infiniteTriggerRef}
                    className="w-full flex justify-center py-8"
                >
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {!hasMore && items.length > 0 && (
                <div className="text-center text-gray-400 text-sm mt-8 w-full">
                    No more items to load.
                </div>
            )}
        </div>
    );
}

export default BookmarkedMarketFeed;
