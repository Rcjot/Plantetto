import { useCallback, useEffect, useRef, useState } from "react";
import bookmarksApi from "@/api/bookmarksApi";
import type { GuideType } from "@/features/guides/guideTypes";
import PublishedGuideCard from "@/features/guides/PublishedGuideCard";

function BookmarkedGuidesFeed() {
    const [guides, setGuides] = useState<GuideType[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const initialFetch = useRef(false);
    const infiniteTriggerRef = useRef<HTMLDivElement>(null);

    const fetchGuides = useCallback(async () => {
        setLoading(true);
        const { guides: resGuides, ok } =
            await bookmarksApi.fetchBookmarkedGuides(page);

        if (ok) {
            setGuides((prev) => [...prev, ...resGuides]);
            if (resGuides.length < 12) {
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
        fetchGuides();
    }, []);

    useEffect(() => {
        if (!infiniteTriggerRef.current) return;
        const observedRef = infiniteTriggerRef.current;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !loading && hasMore) {
                fetchGuides();
            }
        });
        observer.observe(observedRef);
        return () => {
            if (observedRef) observer.unobserve(observedRef);
            observer.disconnect();
        };
    }, [loading, hasMore, fetchGuides]);

    return (
        <div className="flex flex-col w-full pb-10">
            {guides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {guides.map((guide) => (
                        <PublishedGuideCard
                            key={guide.uuid}
                            guideCard={guide}
                        />
                    ))}
                </div>
            ) : (
                !loading && (
                    <div className="text-center text-gray-500 mt-10">
                        You haven't bookmarked any guides yet.
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

            {!hasMore && guides.length > 0 && (
                <div className="text-center text-gray-400 text-sm mt-8 w-full">
                    No more guides to load.
                </div>
            )}
        </div>
    );
}

export default BookmarkedGuidesFeed;