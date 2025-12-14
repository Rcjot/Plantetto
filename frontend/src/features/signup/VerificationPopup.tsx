import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { MailCheck } from "lucide-react";
import authApi from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function VerificationPopup({
    open,
    setOpen,
    hasAvailableCode,
    email,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    hasAvailableCode: boolean;
    email: string;
}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown === 0) return;

        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0; // end cooldown
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldown]);
    async function handleSendCode() {
        const { ok } = await authApi.verifyEmailSignup(value, email);

        if (ok) {
            setOpen(false);
            navigate("/signin");
            toast.success("signed up :)");
        } else {
            setError("invalid code or already expired");
        }
    }

    async function handleResendCode() {
        const { ok } = await authApi.resendVerificationCode(email);

        if (ok) {
            setCooldown(70);
            toast.success("resent verification code!");
        } else {
            toast.warn(
                "too much request! please wait for a while before requesting to resend code!"
            );
            setCooldown(70);
        }
    }
    useEffect(() => {
        if (hasAvailableCode) {
            toast.warn(
                "Already have sent to your email, previous form submission did not save"
            );
        }
        setCooldown(60);
    }, [hasAvailableCode]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-[450px] max-h-[95vh] overflow-y-auto bg-base-100 [&>button]:hidden"
            >
                <DialogHeader className="gap-2">
                    <DialogTitle className="text-center self-center">
                        <MailCheck size={64} className="self-center" />
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {hasAvailableCode
                            ? `Already sent to ${email}. Did not save previous form submission`
                            : `Almost there! Sent verification code to ${email}`}
                    </DialogDescription>

                    <div className="flex justify-center mt-5">
                        <InputOTP
                            maxLength={6}
                            value={value}
                            onChange={(value) => {
                                setValue(value);
                                setError("");
                            }}
                            pattern={REGEXP_ONLY_DIGITS}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <p className="text-center text-xs text-warning-content">
                        {error}
                    </p>
                    <div className="flex text-xs items-center justify-center gap-0">
                        <span> Didn't get a code? </span>
                        <button
                            className="btn btn-link text-xs p-0 pl-1"
                            onClick={handleResendCode}
                            disabled={cooldown > 0}
                        >
                            {cooldown > 0
                                ? `Resend in ${cooldown}s`
                                : "Resend Code"}
                        </button>
                    </div>

                    <button
                        disabled={value.length < 6}
                        onClick={handleSendCode}
                        className="btn btn-primary w-fit self-center px-5 mt-2"
                    >
                        verify
                    </button>
                    <p className="text-center text-xs">
                        Plants are waiting for you!
                    </p>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default VerificationPopup;
