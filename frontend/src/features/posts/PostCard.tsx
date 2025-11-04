import type { PostType } from "./postTypes";
import PostHeader from "./PostHeader";
import PostCarousel from "./PostCarousel";
import { useNavigate, useLocation } from "react-router-dom";

function PostCard({ post }: { post: PostType }) {
    const navigate = useNavigate();
    const location = useLocation();

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

        navigate(`/home/${post.author.username}/${post.post_uuid}`, {
            state: { background: location, post: post },
        });
    }

    return (
        <div
            onClick={openPost}
            className="flex max-w-[600px] bg-base-200 p-4 rounded-xl cursor-pointer"
        >
            <div className="flex flex-col gap-2 w-full">
                <div className="flex">
                    <PostHeader
                        user={post.author}
                        createdAt={post.created_at}
                        postCaption={post.caption}
                    />
                    <div
                        className="ml-auto dropdown dropdown-start"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div
                            tabIndex={0}
                            role="button"
                            className="cursor-pointer"
                        >
                            options
                        </div>
                        <ul
                            tabIndex={-1}
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-2"
                        >
                            <li>
                                <button>edit</button>
                            </li>
                            <li>
                                <button>delete</button>
                            </li>
                        </ul>
                    </div>
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
            </div>
        </div>
    );
}

export default PostCard;
