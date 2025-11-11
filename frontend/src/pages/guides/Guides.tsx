import { Link } from "react-router-dom";

function Guides() {
    return (
        <div className="myEditor flex flex-col items-center  p-5">
            <Link to="/guides/board" className="btn btn-primary">
                board
            </Link>
            <div>
                <div>show community guides ....</div>
                <div>show community guides ....</div>
                <div>show community guides ....</div>
                <div>show community guides ....</div>
                <div>show community guides ....</div>
            </div>
        </div>
    );
}

export default Guides;
