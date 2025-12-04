import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function SettingsThemes() {
    return (
        <div className="flex flex-col gap-20 p-3 sm:p-10">
            {/* Page Title */}
            <div className="flex gap-2">
                <Link to={"/settings"} className="self-start w-fit">
                    <ArrowLeft size={32} />
                </Link>

                {/* Page Title */}
                <h1 className="text-2xl font-bold">Themes</h1>
            </div>
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-700">Themes</h2>
                {/* You can place the account form or details here */}
                <p className="text-base text-gray-700">
                    Settings Theme page content goes here.
                </p>
            </div>
        </div>
    );
}

export default SettingsThemes;