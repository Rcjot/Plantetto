import { Outlet } from "react-router-dom";

function MasterLayout() {
    return (
        <div id="outlet">
            <Outlet />
        </div>
    );
}

export default MasterLayout;
