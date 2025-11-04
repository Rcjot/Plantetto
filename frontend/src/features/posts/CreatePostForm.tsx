import mediaIcon from "@/assets/icons/mediaIcon.svg";

function CreatePostForm() {
    return (
        <>
            <form className="flex flex-col gap-3">
                <textarea
                    className="textarea w-full  max-h-[350px] overflow-y-auto"
                    placeholder="What's growing today?"
                ></textarea>
                <div className="card w-full card-md border p-1 flex-row justify-between ">
                    <button type="button">
                        <h1 className="hover:bg-base-300 p-1 rounded-full px-3 w-fit cursor-pointer">
                            Add to your post
                        </h1>
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer mr-10 hover:bg-base-300 rounded-sm p-1"
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
