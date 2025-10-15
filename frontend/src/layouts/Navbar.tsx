import { Link } from "react-router-dom";
import { useEffect } from "react"
import search_icon from "../assets/icons/search.svg";
import chat_icon from "../assets/icons/chat.svg";
import notification_icon from "../assets/icons/notification.svg";
import garden_icon from "../assets/icons/my_garden.svg";
import menu_icon from "../assets/icons/menu.svg";

export default function Navbar() {
    useEffect(() => {
        console.log("Width:", window.innerWidth);
    }, []);


  const navbar_style = "navbar bg-[#ffffff] px-4 py-2 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200";

  return (
    <div className={navbar_style}>
      {/* left suide of nav */}
      <div className="flex items-center gap-2">
        {/* menu button, hidden if not on mobile view */}
        <label
          htmlFor="sidebar-drawer"
          className="btn bg-white border-none lg:hidden p-2 min-h-0 h-8 w-8 flex items-center justify-center"
        >
          <img src={menu_icon} alt="Menu" className="w-5 h-5" />
        </label>

        {/* logo n title */}
        <div className="flex items-center gap-2">
          <img src={garden_icon} alt="LogoPlaceholder" className="w-8 h-8" />
          <h1 className="text-xl lg:text-2xl font-bold text-black hidden sm:block">
            Plantetto
          </h1>
        </div>
      </div>

      {/* search barr*/}
      <div className="flex-1 flex justify-center px-2">
        <img src={search_icon} alt="Search" className="w-6 h-6 mr-3 mt-1.5"/>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-full max-w-xs sm:max-w-sm md:max-w-md bg-white text-black border-gray-200"
        />
      </div>

      {/* right side of nav*/}
      <div className="flex items-center gap-3 sm:gap-5">
        <img src={chat_icon} alt="Chat" className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
        <img
          src={notification_icon}
          alt="Notifications"
          className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
        />
        <Link to="/profile" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-base-300 cursor-pointer"></Link>
      </div>
    </div>
  );
}