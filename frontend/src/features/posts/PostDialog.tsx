import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import PostHeader from "@/features/posts/PostHeader";
import PostCarousel from "./PostCarousel";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import postsApi from "@/api/postsApi";
import type { PostType } from "./postTypes";

function PostDialog() {
    // const [open, setOpen] = useState(true); //not needed?
    const { post_uuid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState<PostType | null>(null);
    console.log(location);

    useEffect(() => {
        console.log(location.state && post_uuid);
        if (!location.state && post_uuid) {
            const fetchPost = async () => {
                const post = await postsApi.fetchPostByUUID(post_uuid);
                setPost(post);
            };
            fetchPost();
        } else {
            setPost(location.state.post);
        }
    }, [post_uuid, location]);

    return (
        <>
            {post && (
                <Dialog
                    open={true} // always sets to true, because on visit dialog always is open?
                    onOpenChange={(open) => {
                        // setOpen(open); // ????
                        if (!open) {
                            navigate("/home");
                        }
                    }}
                >
                    <DialogContent className=" p-0 min-w-[95vw] sm:p-3 sm:min-w-max md:min-h-max bg-base-100 ">
                        <DialogHeader className="md:max-w-[700px] p-3 lg:max-w-max lg:grid lg:grid-cols-[1fr_250px]">
                            {post.media.length > 0 &&
                                post.highlight_height &&
                                post.highlight_width && (
                                    <div
                                        className={`order-2 lg:order-1 max-w-[100vw] sm:max-w-[65vw] max-h-[90vh]`}
                                    >
                                        <PostCarousel
                                            mediaList={post.media}
                                            view="viewpost"
                                            highlight_height={
                                                post.highlight_height
                                            }
                                            highlight_width={
                                                post.highlight_width
                                            }
                                        />
                                    </div>
                                )}
                            <div className="order-1  lg:order-2">
                                <DialogTitle className="text-center hidden">
                                    view post
                                </DialogTitle>
                                <DialogDescription className="text-center hidden">
                                    view post
                                </DialogDescription>
                                <PostHeader
                                    user={post.author}
                                    createdAt={post.created_at}
                                    postCaption={post.caption}
                                />
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default PostDialog;
