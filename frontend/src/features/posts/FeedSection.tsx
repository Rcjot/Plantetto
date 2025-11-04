import postsApi from "@/api/postsApi";
import { useEffect, useState } from "react";
import type { PostType } from "./postTypes";
import PostCardProvider from "./context/PostProvider";

function FeedSection() {
    const [posts, setPosts] = useState<PostType[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const resPosts = await postsApi.fetchPosts();
            console.log(resPosts);
            setPosts(resPosts);
        };
        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col gap-10 w-full">
            {posts.length > 0 &&
                posts.map((post) => {
                    return (
                        <PostCardProvider
                            key={post.post_uuid}
                            passedPost={post}
                        />
                    );
                })}
        </div>
    );
}

export default FeedSection;
