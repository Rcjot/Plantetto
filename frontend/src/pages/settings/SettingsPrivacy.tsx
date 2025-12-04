import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
function SettingsPrivacy() {
    return (
        <div className="flex flex-col gap-7 p-3 sm:p-10">
            <div className="flex gap-2">
                <Link to={"/settings"} className="self-start w-fit">
                    <ArrowLeft size={32} />
                </Link>

                {/* Page Title */}
                <h1 className="text-2xl font-bold">Privacy Policy</h1>
            </div>
            <div>
                {/* You can place the account form or details here */}
                <p className="text-base text-gray-700">
                    Settings Privacy page content goes here.
                </p>
            </div>
        </div>
    );
}

export default SettingsPrivacy;