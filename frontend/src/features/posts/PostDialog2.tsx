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
import { useSearchParams } from "react-router-dom";
import postsApi from "@/api/postsApi";
import type { PostType } from "./postTypes";
import { CommentSectionWithMedia } from "../comments/PostComments/CommentSectionWithMedia";
import { CommentSectionWithoutMedia } from "../comments/PostComments/CommentSectionWithoutMedia";

function PostDialog2({ postUuid }: { postUuid: string | null }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [post, setPost] = useState<PostType | null>(null);
    const hasMedia = post && post.media && post.media.length > 0;
    useEffect(() => {
        if (postUuid) {
            const fetchPost = async () => {
                const fetchedPost = await postsApi.fetchPostByUUID(postUuid);
                setPost(fetchedPost);
            };
            fetchPost();
        }
    }, [postUuid]);

    return (
        <>
            {post && (
                <Dialog
                    open={true}
                    onOpenChange={(open) => {
                        if (!open) {
                            const params = new URLSearchParams(searchParams);
                            params.delete("post");
                            setSearchParams(params, { replace: true });
                        }
                    }}
                >
                    <DialogContent className="p-0 min-w-[95vw] sm:p-3 md:min-w-max md:min-h-max bg-base-100">
                        <DialogHeader
                            className={`p-5 gap-4 max-h-[90vh] overflow-hidden transition-all duration-300
                                    ${
                                        hasMedia
                                            ? "md:max-w-[900px] lg:max-w-max lg:grid lg:grid-cols-[1fr_350px]"
                                            : "md:max-w-[600px] w-full mx-auto flex flex-col"
                                    }
                                `}
                        >
                            <div className="w-full text-left order-1 lg:hidden pb-2 shrink-0">
                                <PostHeader
                                    user={post.author}
                                    createdAt={post.created_at}
                                    postCaption={post.caption}
                                    planttags={post.planttags}
                                />
                            </div>

                            {hasMedia &&
                                post.highlight_height &&
                                post.highlight_width && (
                                    <div className="order-2 lg:order-1 max-w-[100vw] sm:max-w-[65vw] max-h-[90vh] flex items-center justify-center bg-black/5 rounded-md overflow-hidden">
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

                            <div
                                className={`flex flex-col h-full min-h-0 ${
                                    hasMedia ? "order-3 lg:order-2" : "w-full"
                                }`}
                            >
                                <DialogTitle className="text-center hidden">
                                    view post
                                </DialogTitle>
                                <DialogDescription className="text-center hidden">
                                    view post
                                </DialogDescription>

                                <div className="flex-shrink-0 hidden lg:block">
                                    <PostHeader
                                        user={post.author}
                                        createdAt={post.created_at}
                                        postCaption={post.caption}
                                        planttags={post.planttags}
                                    />
                                </div>

                                <div className="divider my-0"></div>

                                <div className="flex-grow min-h-0 overflow-hidden flex flex-col mt-2">
                                    {hasMedia ? (
                                        <CommentSectionWithMedia
                                            postUuid={post.post_uuid}
                                        />
                                    ) : (
                                        <CommentSectionWithoutMedia
                                            postUuid={post.post_uuid}
                                        />
                                    )}
                                </div>
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default PostDialog2;
