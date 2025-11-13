import guidesApi from "@/api/guidesApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import GuideCard from "@/features/guides/board/GuideCard";
import type { GuideType } from "@/features/guides/guideTypes";
import { useCallback, useEffect, useState } from "react";

function GuidesBoard() {
    const { auth } = useAuthContext()!;
    const [board, setBoard] = useState<GuideType[] | null>(null);

    const fetchBoard = useCallback(async () => {
        if (auth.user?.username) {
            const { board } = await guidesApi.getUserBoard(auth.user.username);
            setBoard(board);
        }
    }, [auth]);

    useEffect(() => {
        fetchBoard();
    }, [fetchBoard]);

    async function handleCreateGuide() {
        const { ok } = await guidesApi.createGuide();
        if (ok) {
            fetchBoard();
        }
    }

    if (board === null) return <div>loading...</div>;

    return (
        <div className="flex flex-col gap-7 p-10">
            <button
                className="btn btn-primary self-start"
                onClick={handleCreateGuide}
            >
                create a new guide
            </button>

            <div className="flex flex-wrap gap-3">
                {board.map((boardCard) => {
                    return (
                        <GuideCard
                            key={boardCard.uuid}
                            guideCard={boardCard}
                            refetch={fetchBoard}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default GuidesBoard;
