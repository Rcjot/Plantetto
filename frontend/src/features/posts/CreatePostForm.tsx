import mediaIcon from "@/assets/icons/mediaIcon.svg";
import { useRef, useState } from "react";
import PostCarousel from "./PostCarousel";

function CreatePostForm() {
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const [media, setMedia] = useState<FileList | string>("");
    const [preview, setPreview] = useState<string[]>([""]);

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.files);
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;
        const files = e.target.files;
        const filesArray = Array.from(e.target.files);
        const mediaUrlList = filesArray.map((file) =>
            URL.createObjectURL(file)
        );
        setMedia(files);
        setPreview(mediaUrlList);
    }

    return (
        <>
            <form className="flex flex-col gap-3">
                <input
                    ref={mediaInputRef}
                    type="file"
                    name="media"
                    className="hidden"
                    onChange={handleImage}
                    multiple
                />
                <textarea
                    className="textarea w-full  max-h-[350px] overflow-y-auto"
                    placeholder="What's growing today?"
                ></textarea>
                {media && <PostCarousel imageList={preview} />}

                <div className="card w-full card-md border p-1 flex-row justify-between ">
                    <button
                        type="button"
                        onClick={() => {
                            mediaInputRef.current?.click();
                        }}
                    >
                        <h1 className="hover:bg-base-300 p-1 rounded-full px-3 w-fit cursor-pointer">
                            Add to your post
                        </h1>
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer mr-10 hover:bg-base-300 rounded-sm p-1"
                        onClick={() => {
                            mediaInputRef.current?.click();
                        }}
                    >
                        <img
                            src={mediaIcon}
                            className="w-10 h-10  "
                            alt="add media"
                        />
                    </button>
                </div>
                <button className="btn btn-primary w-fit px-10 self-center">
                    Post
                </button>
            </form>
        </>
    );
}

export default CreatePostForm;
