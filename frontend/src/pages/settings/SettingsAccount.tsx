import { useState } from "react";
import EmailIcon from "@/assets/icons/changeemail.svg";
import PasswordIcon from "@/assets/icons/changepassword.svg";
import SettingItem from "@/components/ui/SettingItem";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";
import ChangeEmailModal from "@/components/ui/ChangeEmailModal";

function SettingsAccount() {
    const [modal, setModal] = useState<"email" | "password" | null>(null);

    return (
        <div className="flex flex-col gap-20 p-3 sm:p-10">
            
            {/* Page Title */}
            <h1 className="text-2xl font-bold">Settings</h1>

            {/* Account Info Section */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-700">
                    Your account
                </h2>

                <div className="flex flex-col gap-1 max-w-lg">
                    <SettingItem
                        icon={EmailIcon}
                        label="Change your email address"
                        onClick={() => setModal("email")}
                    />

                    <SettingItem
                        icon={PasswordIcon}
                        label="Change your password"
                        onClick={() => setModal("password")}
                    />
                </div>

                {/* Modals */}
                {modal === "password" && (
                    <ChangePasswordModal
                        title="Change your password"
                        onClose={() => setModal(null)}
                    />
                )}

                {modal === "email" && (
                    <ChangeEmailModal
                        title="Change your email address"
                        onClose={() => setModal(null)}
                    />
                )}
            </div>

        </div>
    );
}

export default SettingsAccount;
