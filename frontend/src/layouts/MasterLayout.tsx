import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function MasterLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#ffffff]">
      <Navbar />
        <Sidebar>
            <Outlet/>
        </Sidebar>

      </div>
  );
}

export default MasterLayout;