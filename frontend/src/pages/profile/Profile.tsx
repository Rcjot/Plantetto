import { useParams } from "react-router-dom";

function Profile() {
    const { id } = useParams();
    return <div>profile of user {id}</div>;
}

export default Profile;
