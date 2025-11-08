import { useEffect, useState } from "react";

function LoadImages() {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            const images = [];
            for (let i = 1; i <= 23; i++) {
                const img = await import(
                    `@/assets/LandingPage/HeroImages/plant${i}.jpg`
                );
                images.push(img.default);
            }
            setImages(images);
        };
        fetchImages();
    }, []);
    return { images };
}

export function HeroImages() {
    const { images } = LoadImages();
    // const images = [
    //     "./src/assets/LandingPage/HeroImages/plant1.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant2.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant3.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant4.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant5.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant6.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant7.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant8.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant9.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant10.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant11.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant12.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant13.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant14.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant15.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant16.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant17.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant18.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant19.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant20.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant21.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant22.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant23.jpg",
    //     "./src/assets/LandingPage/HeroImages/plant24.jpg",
    // ];
    return (
        <div className="absolute inset-0 flex justify-center overflow-hidden mx-[10px]">
            {/* Group 1*/}
            <div className="flex gap-6">
                {/* Column 1 */}
                <div className="flex flex-col gap-[20px] items-center mt-[275px]">
                    <img
                        className="w-[225px] h-[300px] rounded-[10px] opacity-[.70]"
                        src={images[0]}
                    />
                    <img
                        className="w-[195px] h-[260px] rounded-[10px] opacity-[.70]"
                        src={images[1]}
                    />
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-[20px] items-start mt-[380px]">
                    <img
                        className="w-[200px] h-[265px] rounded-[10px] opacity-[.40]"
                        src={images[2]}
                    />
                    <img
                        className="w-[145px] h-[195px] rounded-[10px] opacity-[.60]"
                        src={images[3]}
                    />
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-[20px] items-end mt-[465px]">
                    <img
                        className="w-[135px] h-[180px] rounded-[10px] opacity-[.40]"
                        src={images[4]}
                    />
                    <img
                        className="w-[200px] h-[265px] rounded-[10px] opacity-[.20]"
                        src={images[5]}
                    />
                </div>
            </div>

            <div className="mx-[80px]" />

            {/* Group 2: Columns 4-6 */}
            <div className="flex gap-6">
                {/* Column 4 */}
                <div className="flex flex-col gap-[20px] items-start mt-[510px]">
                    <img
                        className="w-[150px] h-[200px] rounded-[10px] opacity-[.25]"
                        src={images[6]}
                    />
                    <img
                        className="w-[200px] h-[200px] rounded-[10px] opacity-[.20]"
                        src={images[7]}
                    />
                </div>

                {/* Column 5 */}
                <div className="flex flex-col gap-[20px] items-end mt-[400px]">
                    <img
                        className="w-[250px] h-[330px] rounded-[10px] opacity-[.60]"
                        src={images[8]}
                    />
                    <img
                        className="w-[195px] h-[260px] rounded-[10px] opacity-[.40]"
                        src={images[9]}
                    />
                </div>

                {/* Column 6 */}
                <div className="flex flex-col gap-[20px] items-end mt-[295px]">
                    <img
                        className="w-[225px] h-[335px] rounded-[10px] opacity-[.70]"
                        src={images[10]}
                    />
                    <img
                        className="w-[200px] h-[290px] rounded-[10px] opacity-[.70]"
                        src={images[11]}
                    />
                </div>
            </div>
        </div>
    );
}
