import { Link } from "react-router-dom";

import ProfileIcon from "@/assets/icons/profile1.svg";
import ThemesIcon from "@/assets/icons/themes.svg";
import TermsIcon from "@/assets/icons/termsofservice.svg";
import PrivacyIcon from "@/assets/icons/privacypolicy.svg";
import CookiesIcon from "@/assets/icons/cookiespolicy.svg";
import StandardIcon from "@/assets/icons/communitystandard.svg";


function Settings() {
    return (
        <div className="flex flex-col gap-20 p-3 sm:p-10">
            {/* Page Title */}
            <h1 className="text-2xl font-bold">Settings</h1>

            {/* ========== SECTION: Your Account ========== */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-700">
                    Your account
                </h2>

                <Link
                    to="/settings/accountsinformation"
                    className="flex items-center gap-1 py-0"
                >
                    <img src={ProfileIcon} className="w-13 h-13" />
                    <span className="text-base">Account Information</span>
                </Link>
            </div>

            {/* ========== SECTION: Display ========== */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-700">Display</h2>

                <Link
                    to="/settings/settingsthemes"
                    className="flex items-center gap-1 py-0"
                >
                    <img src={ThemesIcon} className="w-13 h-13" />
                    <span className="text-base">Themes</span>
                </Link>
            </div>

            {/* ========== SECTION: Community Standards and Legal ========== */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-700">
                    Community Standards and legal policies
                </h2>

                <Link
                    to="/settings/settingsterms"
                    className="flex items-center gap-1 py-0"
                >
                    <img src={TermsIcon} className="w-13 h-13" />
                    <span className="text-base">Terms of Service</span>
                </Link>

                <Link
                    to="/settings/settingsprivacy"
                    className="flex items-center gap-1 py-0"
                >
                    <img src={PrivacyIcon} className="w-13 h-13" />
                    <span className="text-base">Privacy Policy</span>
                </Link>

                <Link
                    to="/settings/settingscookies"
                    className="flex items-center gap-1 py-0"
                >
                    <img src={CookiesIcon} className="w-13 h-13" />
                    <span className="text-base">Cookies Policy</span>
                </Link>

                <Link
                    to="/settings/settingsstandards"
                    className="flex items-center gap-1 py-0"
                >
                    <img src={StandardIcon} className="w-13 h-13" />
                    <span className="text-base">Community Standards</span>
                </Link>
            </div>
        </div>
    );
}

export default Settings;
