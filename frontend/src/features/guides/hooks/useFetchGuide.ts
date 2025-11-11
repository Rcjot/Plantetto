import { useEffect, useState } from "react";
import type { GuideType } from "../guideTypes";
import guidesApi from "@/api/guidesApi";

function useFetchGuide(guide_uuid?: string) {
    const [guide, setGuide] = useState<GuideType | null>(null);

    useEffect(() => {
        const fetchGuide = async () => {
            if (guide_uuid) {
                const { guide } = await guidesApi.getGuide(guide_uuid);
                setGuide(guide);
            }
        };
        fetchGuide();
    }, [guide_uuid]);

    return guide;
}

export default useFetchGuide;
