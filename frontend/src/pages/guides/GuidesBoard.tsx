import guidesApi from "@/api/guidesApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import BoardCard from "@/features/guides/board/BoardCard";
import type { GuideType } from "@/features/guides/guideTypes";
import { useEffect, useState } from "react";

function GuidesBoard() {
    const { auth } = useAuthContext()!;
    const [board, setBoard] = useState<GuideType[] | null>(null);

    useEffect(() => {
        const fetchBoard = async () => {
            if (auth.user?.username) {
                const { board } = await guidesApi.getUserBoard(
                    auth.user.username
                );
                setBoard(board);
            }
        };
        fetchBoard();
    }, [auth]);

    if (board === null) return <div>loading...</div>;

    return (
        <div>
            <button className="btn btn-primary"> create a new guide </button>

            {board.map((boardCard) => {
                return <BoardCard key={boardCard.uuid} boardCard={boardCard} />;
            })}
        </div>
    );
}

export default GuidesBoard;
