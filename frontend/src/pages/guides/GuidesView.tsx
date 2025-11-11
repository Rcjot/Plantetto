import { useParams } from "react-router-dom";

function GuidesView() {
    const { uuid } = useParams();
    return <div>{uuid}</div>;
}

export default GuidesView;
