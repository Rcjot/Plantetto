import { useState, useEffect, useRef } from "react";
import { useLocation, Outlet, useSearchParams } from "react-router-dom";
import postsApi from "@/api/postsApi";
import plantsApi from "@/api/plantsApi";
import type { PostType } from "@/features/posts/postTypes";
import type { PlanttypeType } from "@/features/garden/gardenTypes";
import ExplorePostCard from "@/features/explore/ExplorePostCard";
import SearchResults from "@/features/explore/SearchResults";
import { Search } from "lucide-react";
import MasonryGrid from "@/features/explore/MasonryGrid";

function Explore() {
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const initialURLSearch = params.get("search") ?? "";

    const [posts, setPosts] = useState<PostType[]>([]);
    const [, setPlantTypes] = useState<PlanttypeType[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(initialURLSearch);
    const [submittedSearch, setSubmittedSearch] = useState(initialURLSearch);
    const [isSearching, setIsSearching] = useState(initialURLSearch !== "");

    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const infiniteTriggerRef = useRef<HTMLDivElement | null>(null);
    const fetchedUUIDs = useRef<Set<string>>(new Set());
    const fetchedTags = useRef<Set<string>>(new Set());
    const initialFetchDone = useRef(false);
    const randomTagSelected = useRef(false);

    useEffect(() => {
        if (location.state?.navSearch) {
            const s = location.state.navSearch;
            setSearch(s);
            setSubmittedSearch(s);
            setIsSearching(s !== "");
        }
    }, [location.state]);

    const fetchPostsForTag = async (
        tag: string,
        cursor: string | null = null,
        reset: boolean = false
    ) => {
        if (loading) return;
        setLoading(true);
        try {
            const { posts: resPosts, nextCursor: resNextCursor } =
                await postsApi.explorePostsOfPlant(tag, cursor);

            const imagePosts = resPosts.filter(
                (p) => p.media.length > 0 && p.media[0].type === "image"
            );

            const newPosts = imagePosts.filter(
                (p) => !fetchedUUIDs.current.has(p.post_uuid)
            );
            newPosts.forEach((p) => fetchedUUIDs.current.add(p.post_uuid));

            setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
            setNextCursor(resNextCursor);
            setHasMore(Boolean(resNextCursor));
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state) {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [location]);

    useEffect(() => {
        async function loadPlantTypes() {
            if (searchParams.get("type")) {
                setSelectedTag(searchParams.get("type"));
                setSearch("");
                setSubmittedSearch("");
                setIsSearching(false);
                return;
            }

            const res = await plantsApi.fetchPlantTypes();
            if (!res.ok || !res.plant_types || res.plant_types.length === 0)
                return;

            setPlantTypes(res.plant_types);

            if (!randomTagSelected.current) {
                randomTagSelected.current = true;

                const randomTag =
                    res.plant_types[
                        Math.floor(Math.random() * res.plant_types.length)
                    ].plant_name;

                setSelectedTag(randomTag);
            }
        }

        loadPlantTypes();
    }, [searchParams]);

    useEffect(() => {
        if (!selectedTag) return;

        if (fetchedTags.current.has(selectedTag)) return;
        fetchedTags.current.add(selectedTag);

        fetchedUUIDs.current.clear();
        setPosts([]);
        setNextCursor(null);
        setHasMore(true);

        fetchPostsForTag(selectedTag, null, true).then(() => {
            initialFetchDone.current = true;
        });
    }, [selectedTag]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = search.trim();

        //navigate(`/explore?search=${encodeURIComponent(trimmed)}`);
        setSearchParams("");
        setSubmittedSearch(trimmed);
        setIsSearching(trimmed !== "");
    };

    useEffect(() => {
        if (!infiniteTriggerRef.current || !selectedTag || isSearching) return;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (
                entry.isIntersecting &&
                !loading &&
                hasMore &&
                initialFetchDone.current
            ) {
                fetchPostsForTag(selectedTag, nextCursor, false);
            }
        });

        observer.observe(infiniteTriggerRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore, nextCursor, selectedTag, isSearching]);

    const openPost = (post: PostType) => {
        const params = new URLSearchParams(searchParams);
        params.set("post", post.post_uuid);
        setSearchParams(params, { replace: true });
    };

    return (
        <div
            key={selectedTag}
            className="flex flex-col gap-6 p-4 sm:p-10 bg-base-100 min-h-screen"
        >
            <div className="w-full max-w-2xl mx-auto">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="input input-bordered w-full pr-12"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {isSearching ? (
                <SearchResults search={submittedSearch} />
            ) : (
                <>
                    {selectedTag && (
                        <div className="flex flex-col gap-3">
                            <h2 className="text-xl font-semibold">
                                Sprouts tagged with: {selectedTag}
                            </h2>
                        </div>
                    )}

                    <MasonryGrid>
                        {posts.map((post) => (
                            <ExplorePostCard
                                key={post.post_uuid}
                                post={post}
                                onClick={() => openPost(post)}
                            />
                        ))}
                    </MasonryGrid>

                    {loading && (
                        <div className="py-8 text-center text-neutral-500">
                            Loading...
                        </div>
                    )}
                    {!hasMore && posts.length > 0 && (
                        <div className="py-8 text-center text-neutral-500">
                            No more posts to explore 🌱
                        </div>
                    )}
                    {!loading && posts.length === 0 && (
                        <div className="py-8 text-center text-neutral-500">
                            No posts found. Try a different search or tag! 🔍
                        </div>
                    )}

                    <div ref={infiniteTriggerRef} />
                </>
            )}

            <Outlet />
        </div>
    );
}

export default Explore;
