import { useEffect, useState } from "react";
import type { GuideType } from "../guideTypes";
import guidesApi from "@/api/guidesApi";

function useFetchGuide(guide_uuid?: string) {
    const [guide, setGuide] = useState<GuideType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchGuide = async () => {
            if (guide_uuid) {
                const { guide } = await guidesApi.getGuide(guide_uuid);
                setGuide(guide);
                setLoading(false);
            }
        };
        fetchGuide();
    }, [guide_uuid]);

    return { loading, guide };
}

export default useFetchGuide;
