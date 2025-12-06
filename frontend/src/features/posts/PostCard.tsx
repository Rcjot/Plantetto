import PostHeader from "@/features/posts/PostHeader";
import PostCarousel from "./PostCarousel";
import { useNavigate, useLocation } from "react-router-dom";
import PostOptionsButton from "./PostOptionsButon";
import { useState } from "react";
import { usePostContext } from "./context/PostContext";
import { useAuthContext } from "../auth/AuthContext";
import { addRecentPost } from "@/features/recent/recentService";
import { InteractionButton } from "@/features/posts/InteractionButtons";

function PostCard() {
    const { post, origin = "/home" } = usePostContext()!;
    const { auth } = useAuthContext()!;
    const navigate = useNavigate();
    const location = useLocation();

    const [deleted, setDeleted] = useState(false);

    function openPost(
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
        section = "card"
    ) {
        if (section === "card") {
            const selection = window.getSelection();
            const isTextSelected = selection && selection.toString().length > 0;
            if (isTextSelected) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
        if (e.target instanceof HTMLElement) {
            if (e.target.closest(".no-propagate")) return;
        }

        if (auth.user?.id) {
            addRecentPost(auth.user.id, post);
        }

        const fullOrigin = location.search ? origin + location.search : origin;

        navigate(`${origin}/${post.author.username}/${post.post_uuid}`, {
            state: { background: location, post: post, origin: fullOrigin },
        });
    }

    if (deleted) {
        return (
            <div className="bg-base-300 p-2 text-neutral rounded-lg">
                post deleted
            </div>
        );
    }

    return (
        <div
            onClick={openPost}
            className="flex max-w-[650px] bg-base-200 p-4 rounded-xl cursor-pointer"
        >
            <div className="flex flex-col gap-2 w-full">
                <div className="flex">
                    <PostHeader
                        user={post.author}
                        createdAt={post.created_at}
                        postCaption={post.caption}
                        planttags={post.planttags}
                    />
                    {auth.user?.id === post.author.id && (
                        <PostOptionsButton setDeleted={setDeleted} />
                    )}
                </div>

                {post.media.length > 0 && (
                    <button
                        className="p-1 rounded-lg cursor-pointer hover:bg-base-300"
                        onClick={(e) => {
                            openPost(e, "carousel");
                        }}
                    >
                        <PostCarousel mediaList={post.media} />
                    </button>
                )}

                <div>
                    <InteractionButton post={post} />
                </div>
            </div>
        </div>
    );
}

export default PostCard;
