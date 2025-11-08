import { Link } from "react-router-dom";
import { useState } from "react";
import search_icon from "../assets/icons/search.svg";
import chat_icon from "../assets/icons/chat.svg";
import notification_icon from "../assets/icons/notification.svg";
import garden_icon from "../assets/icons/my_garden.svg";
import menu_icon from "../assets/icons/menu.svg";
import { useAuthContext } from "@/features/auth/AuthContext";
import ProfilePicture from "@/components/ProfilePicture";
import WebsiteName from "@/assets/LandingPage/Plantetto-logo.svg";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

export default function Navbar() {
    const { auth, logout } = useAuthContext()!;

    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
    const navbar_style =
        "navbar bg-base-100 px-4 py-2 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200";

    const handleConfirmLogout = () => {
        logout();
        setOpenLogoutDialog(false);
    };

    return (
        <>
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
                        <img
                            src={garden_icon}
                            alt="LogoPlaceholder"
                            className="w-7 h-7"
                        />
                        <img
                            className="pl-4 hidden sm:block"
                            src={WebsiteName}
                        />
                        {/* <h1 className="text-xl lg:text-2xl font-bold hidden sm:block">
                            Plantetto
                        </h1> */}
                    </div>
                </div>

                {/* search barr*/}
                <div className="flex-1 flex justify-center px-2">
                    <div className="flex items-center gap-2 w-full max-w-xs sm:max-w-sm md:max-w-md">
                        <img
                            src={search_icon}
                            alt="Search"
                            className="w-6 h-6"
                        />
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered flex-1 bg-white border-gray-200"
                        />
                    </div>
                </div>

                {/* right side of nav*/}
                <div className="flex items-center gap-3 sm:gap-5">
                    <img
                        src={chat_icon}
                        alt="Chat"
                        className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
                    />
                    <img
                        src={notification_icon}
                        alt="Notifications"
                        className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer"
                    />
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="cursor-pointer"
                        >
                            {auth?.user ? (
                                <ProfilePicture size="small" />
                            ) : (
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-300 flex items-center justify-center">
                                    ?
                                </div>
                            )}
                        </div>
                        <ul
                            tabIndex={-1}
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-2"
                        >
                            <li>
                                {/* change later to use uuid */}
                                <Link
                                    to={`/${auth.user?.username}`}
                                    className="text-neutral-800 hover:bg-primary hover:text-neutral-100"
                                >
                                    Check your profile
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={() => setOpenLogoutDialog(true)}
                                    className="text-warning-content hover:bg-warning/90 hover:text-neutral-100 hover:font-extrabold"
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
                <DialogContent className="sm:max-w-md bg-base-100">
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to log out?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="flex justify-end gap-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => setOpenLogoutDialog(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-warning "
                            onClick={handleConfirmLogout}
                        >
                            Log Out
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
