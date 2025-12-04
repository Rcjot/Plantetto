import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function SettingsPrivacy() {
    return (
        <div className="flex flex-col gap-7 p-3 sm:p-10">
            <div className="flex gap-2 items-center">
                <Link to={"/settings"} className="self-start w-fit">
                    <ArrowLeft size={32} />
                </Link>

                {/* Page Title */}
                <h1 className="text-2xl font-bold">Privacy Policy</h1>
            </div>

            <div className="flex flex-col gap-6 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>
                    Your privacy matters to us. This Privacy Policy explains
                    how <span className="font-semibold">Plantetto</span> collects,
                    uses, stores, and protects your information when you use our
                    platform.
                </p>

                {/* 1 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">1. Information We Collect</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Account information (username, email, profile photo)</li>
                        <li>Content you post (photos, videos, stories, guides)</li>
                        <li>Marketplace activity (listings, purchases, messages)</li>
                        <li>Device and usage data (IP address, app activity, logs)</li>
                    </ul>
                </div>

                {/* 2 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>To operate and improve Plantetto</li>
                        <li>To personalize your explore feed and suggestions</li>
                        <li>To enable posting, messaging, guides, and marketplace features</li>
                        <li>To provide customer support and security</li>
                    </ul>
                </div>

                {/* 3 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">3. Sharing of Information</h2>
                    <p>
                        We do not sell your personal data. We may share limited
                        information only when required to operate our services,
                        comply with legal requests, or protect users and the
                        platform.
                    </p>
                </div>

                {/* 4 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">4. Public Content</h2>
                    <p>
                        Content you post such as photos, guides, diary stories,
                        and marketplace listings may be visible to other users
                        depending on your privacy settings. You control who can
                        see your content.
                    </p>
                </div>

                {/* 5 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">5. Messages & Communication</h2>
                    <p>
                        Messages between users are private. Plantetto does not
                        monitor private messages unless required by law or for
                        safety investigations.
                    </p>
                </div>

                {/* 6 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">6. Data Storage & Security</h2>
                    <p>
                        We apply reasonable safeguards to protect your data from
                        unauthorized access, loss, or misuse. However, no online
                        system is 100% secure.
                    </p>
                </div>

                {/* 7 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">7. Your Privacy Controls</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You can update your profile information at any time</li>
                        <li>You can control who sees your posts and stories</li>
                        <li>You may delete your content or account</li>
                    </ul>
                </div>

                {/* 8 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">8. Third-Party Services</h2>
                    <p>
                        Plantetto may use third-party services for hosting,
                        analytics, or security. These providers only receive the
                        information necessary to perform their services.
                    </p>
                </div>

                {/* 9 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">9. Policy for Minors</h2>
                    <p>
                        Plantetto is not intended for children under 13. We do
                        not knowingly collect personal data from minors.
                    </p>
                </div>

                {/* 10 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">10. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time.
                        Continued use of Plantetto means you accept any updates.
                    </p>
                </div>

                {/* 11 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">11. Contact Us</h2>
                    <p>
                        If you have questions about your privacy or this policy,
                        you may contact Plantetto through our official support
                        channels.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SettingsPrivacy;
