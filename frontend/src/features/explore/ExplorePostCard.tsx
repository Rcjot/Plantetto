import type { PostType } from "@/features/posts/postTypes";

interface Props {
    post: PostType;
    onClick: () => void;
}

export default function ExplorePostCard({ post, onClick }: Props) {
    if (post.media.length === 0) return null;

    const media = post.media[0];

    if (media.type !== "image") return null;

    return (
        <div
            onClick={onClick}
            className="cursor-pointer rounded-lg overflow-hidden"
        >
            <img
                src={media.url}
                alt={post.caption || "post image"}
                className="w-full h-auto object-cover rounded-lg"
            />
        </div>
    );
}
