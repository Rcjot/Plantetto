import { useState } from "react";
import SettingItem from "@/components/ui/SettingItem";
import ChangePasswordModal from "@/components/ui/ChangePasswordModal";
import ChangeEmailModal from "@/components/ui/ChangeEmailModal";
import { ArrowLeft, FrownIcon, UserRoundCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
// import { Mail } from "lucide-react";
import { Shield } from "lucide-react";
import VerifyEmailModal from "@/components/ui/VerifyEmailModal";
import { useAuthContext } from "@/features/auth/AuthContext";
import { CameraDialog } from "@/features/settings/Camera";

function SettingsAccount() {
    const { auth } = useAuthContext()!;
    const [modal, setModal] = useState<"email" | "password" | "verify" | null>(
        null
    );

    const [openCamera, setOpenCamera] = useState(false);
    return (
        <div className="flex flex-col gap-20 p-3 sm:p-10">
            <div className="flex gap-2">
                <Link to={"/settings"} className="self-start w-fit">
                    <ArrowLeft size={32} />
                </Link>

                {/* Page Title */}
                <h1 className="text-2xl font-bold">Account Information</h1>
            </div>

            {/* Account Info Section */}
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-gray-700">
                    Your account
                </h2>

                <div className="flex flex-col gap-1 max-w-lg">
                    {/* <SettingItem
                        label="Change your email address"
                        onClick={() => setModal("email")}
                    >
                        <Mail />
                    </SettingItem> */}
                    <SettingItem
                        label="Change your password"
                        onClick={() => setModal("password")}
                    >
                        <Shield />
                    </SettingItem>
                    {!auth.user?.email_verified ? (
                        <SettingItem
                            label="Verify your email"
                            onClick={() => setModal("verify")}
                        >
                            <MailCheck />
                        </SettingItem>
                    ) : (
                        <SettingItem label="Email Verified" onClick={() => {}}>
                            <MailCheck />
                        </SettingItem>
                    )}
                    {auth.user?.seller_verified ? (
                        <SettingItem
                            label="Verified to Sell"
                            onClick={() => {}}
                        >
                            <UserRoundCheck />
                        </SettingItem>
                    ) : (
                        <SettingItem
                            label="Verify to Sell"
                            onClick={() => {
                                setOpenCamera(true);
                            }}
                        >
                            <FrownIcon />
                        </SettingItem>
                    )}
                </div>

                {!auth.user?.seller_verified && (
                    <CameraDialog
                        open={openCamera}
                        setOpenCamera={setOpenCamera}
                    />
                )}
                {/* Modals */}
                {modal === "password" && (
                    <ChangePasswordModal
                        title="Change your password"
                        onClose={() => setModal(null)}
                        username={auth.user?.username}
                    />
                )}

                {modal === "email" && (
                    <ChangeEmailModal
                        title="Change your email address"
                        onClose={() => setModal(null)}
                    />
                )}
                {modal === "verify" && (
                    <VerifyEmailModal
                        title="Verify your email address"
                        onClose={() => setModal(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default SettingsAccount;
