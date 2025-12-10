import { Link } from "react-router-dom";

import ProfileIcon from "@/assets/icons/profile1.svg";
import TermsIcon from "@/assets/icons/termsofservice.svg";
import PrivacyIcon from "@/assets/icons/privacypolicy.svg";
import CookiesIcon from "@/assets/icons/cookiespolicy.svg";
import StandardIcon from "@/assets/icons/communitystandard.svg";

function Settings() {
    const linkStyle =
        "flex items-center gap-2 p-2 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200 w-fit";

    return (
        <div className="flex flex-col gap-20 p-3 sm:p-10">
            {/* Page Title */}
            <h1 className="text-2xl font-bold">Settings</h1>

            {/* ========== SECTION: Your Account ========== */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-700">
                    Your account
                </h2>

                <Link to="/settings/accountsinformation" className={linkStyle}>
                    <img src={ProfileIcon} className="w-13 h-13" />
                    <span className="text-base">Account Information</span>
                </Link>
            </div>

            {/* ========== SECTION: Display ========== */}

            {/* ========== SECTION: Community Standards and Legal ========== */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-700">
                    Community Standards and legal policies
                </h2>

                <Link to="/settings/terms" className={linkStyle}>
                    <img src={TermsIcon} className="w-13 h-13" />
                    <span className="text-base">Terms of Service</span>
                </Link>

                <Link to="/settings/privacy" className={linkStyle}>
                    <img src={PrivacyIcon} className="w-13 h-13" />
                    <span className="text-base">Privacy Policy</span>
                </Link>

                <Link to="/settings/cookies" className={linkStyle}>
                    <img src={CookiesIcon} className="w-13 h-13" />
                    <span className="text-base">Cookies Policy</span>
                </Link>

                <Link to="/settings/standards" className={linkStyle}>
                    <img src={StandardIcon} className="w-13 h-13" />
                    <span className="text-base">Community Standards</span>
                </Link>
            </div>
        </div>
    );
}

export default Settings;
