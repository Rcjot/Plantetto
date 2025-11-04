function PostCard({ keyId, src }: { keyId: number; src: string }) {
    return (
        <div
            key={keyId}
            // className="card card-xl h-[650px] w-[550px] border bg-200 m-4 flex flex-col p-2 items-center"
            className="card card-xl border min-w-full bg-base-base-200 flex flex-col justify-center overflow-hidden"
        >
            <img
                src={src}
                className=" w-full max-h-[600px] object-contain"
                alt=""
            />
        </div>
    );
}

export default PostCard;
