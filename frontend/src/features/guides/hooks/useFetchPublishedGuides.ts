import { useEffect, useState } from "react";
import type { GuideType } from "../guideTypes";
import guidesApi from "@/api/guidesApi";

function useFetchPublishedGuides() {
    const [guides, setGuides] = useState<GuideType[] | null>([]);

    useEffect(() => {
        const fetchGuide = async () => {
            const { guides: resGuides } = await guidesApi.getPublishedGuides();
            setGuides(resGuides);
        };
        fetchGuide();
    }, []);

    return guides;
}

export default useFetchPublishedGuides;
