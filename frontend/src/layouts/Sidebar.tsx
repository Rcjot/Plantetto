import { NavLink } from "react-router-dom";
import { useRef, useEffect } from "react"
import home_icon from "../assets/icons/home.svg";
import explore_icon from "../assets/icons/explore.svg";
import marketplace_icon from "../assets/icons/marketplace.svg";
import guides_icon from "../assets/icons/community_guides.svg";
import plant_diary_icon from "../assets/icons/plant_diary.svg";
import garden_icon from "../assets/icons/my_garden.svg";
import settings_icon from "../assets/icons/settings.svg";
import bookmark_icon from "../assets/icons/bookmark.svg";

function Sidebar({children}: { children: React.ReactNode }) {
    useEffect(() => {
        console.log("Width:", window.innerWidth);
    }, []);

    const drawerRef = useRef<HTMLInputElement>(null);

    function drawToggle() {
        drawerRef.current!.checked = false;
    }

  const custom_hover_button = "flex items-center gap-3 p-2 rounded-xl transition text-xl hover:bg-[#92D49C] hover:text-black active:bg-[#7fc18b] active:text-black";
  const sidebar_style = "menu bg-[#ffffff] text-black min-h-full border-r border-gray-200 -5 flex flex-col w-[18rem] max-w-[22vw] min-w-[12rem] overflow-y-auto transition-all duration-300";

  return (
    <div className="drawer lg:drawer-open flex-1 overflow-hidden">
        <input id="sidebar-drawer" ref={drawerRef} type="checkbox" className="drawer-toggle transition"/>
        <div className="drawer-content flex flex-col">
          <div id="outlet" className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
        <div className="drawer-side z-[60] lg:z-0 transition">
        <label
            htmlFor="sidebar-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"> </label>

        <ul className={`${sidebar_style} flex flex-col gap-y-1`}>
            <li>
                <NavLink to="/home" onClick={drawToggle} 
                    className={({ isActive }) => `${custom_hover_button} ${isActive ? "bg-[#92D49C] text-black font-semibold" : ""}`}>
                    <img src={home_icon} alt="Home" className="w-5 h-5" />
                    <span>Home</span>
            </NavLink>
            </li>

            <li>
                <button className={custom_hover_button}>
                    <img src={explore_icon} alt="Explore" className="w-5 h-5" />
                    <span>Explore</span>
                </button>
            </li>

            <li>
                <button className={custom_hover_button}>
                    <img src={marketplace_icon} alt="Marketplace" className="w-5 h-5"/>
                    <span>Marketplace</span>
                </button>
            </li>

            <li>
                <button className={custom_hover_button}>
                    <img src={guides_icon} alt="Community Guides" className="w-5 h-5" />
                    <span>Community Guides</span>
                </button>
            </li>

            <li>
                <button className={custom_hover_button}>
                    <img src={plant_diary_icon} alt="Plant Diary" className="w-5 h-5"/>
                    <span>My Plant Diary</span>
                </button>
            </li>

            <li>
                <NavLink to="/mygarden" onClick={drawToggle}
                    className={({ isActive }) => `${custom_hover_button} ${ isActive ? "bg-[#92D49C] text-black font-semibold" : ""}`}>
                    <img src={garden_icon} alt="My Garden" className="w-5 h-5" />
                    <span>My Garden</span>
                </NavLink>
            </li>

            <li>
            <button className={custom_hover_button}>
                <img src={bookmark_icon} alt="Bookmarks" className="w-5 h-5" />
                <span>Bookmarks</span>
            </button>
            </li>

            <li>
            <button className={custom_hover_button}>
                <img src={settings_icon} alt="Settings" className="w-5 h-5" />
                <span>Settings</span>
                </button>
            </li>
            </ul>
        </div>
    </div>
  );
}

export default Sidebar;