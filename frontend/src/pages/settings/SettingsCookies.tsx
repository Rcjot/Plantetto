import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function SettingsCookies() {
    return (
        <div className="flex flex-col gap-7 p-3 sm:p-10">
            <div className="flex gap-2 items-center">
                <Link to={"/settings"} className="self-start w-fit">
                    <ArrowLeft size={32} />
                </Link>

                {/* Page Title */}
                <h1 className="text-2xl font-bold">Cookies Policy</h1>
            </div>

            <div className="flex flex-col gap-6 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>
                    This Cookies Policy explains how{" "}
                    <span className="font-semibold">Plantetto</span> uses cookies
                    and similar technologies to improve your experience on our
                    platform.
                </p>

                {/* 1 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">1. What Are Cookies?</h2>
                    <p>
                        Cookies are small text files stored on your device when
                        you visit a website. They help the platform remember
                        your preferences and improve functionality.
                    </p>
                </div>

                {/* 2 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">2. How We Use Cookies</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>To keep you signed in to your account</li>
                        <li>To remember your settings and preferences</li>
                        <li>To improve performance and security</li>
                        <li>To understand how users interact with Plantetto</li>
                    </ul>
                </div>

                {/* 3 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">3. Types of Cookies We Use</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Essential cookies for login and security</li>
                        <li>Functional cookies for settings and preferences</li>
                        <li>Analytics cookies to improve features and content</li>
                    </ul>
                </div>

                {/* 4 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">4. Third-Party Cookies</h2>
                    <p>
                        We may allow trusted third-party services to place
                        cookies on your device for analytics, performance, and
                        security purposes. These services follow their own
                        privacy policies.
                    </p>
                </div>

                {/* 5 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">5. Managing Your Cookies</h2>
                    <p>
                        You can control or disable cookies through your browser
                        settings. Please note that disabling certain cookies may
                        affect the functionality of Plantetto.
                    </p>
                </div>

                {/* 6 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">6. Updates to This Policy</h2>
                    <p>
                        We may update this Cookies Policy from time to time.
                        Continued use of Plantetto after updates means you agree
                        to the revised policy.
                    </p>
                </div>

                {/* 7 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">7. Contact Us</h2>
                    <p>
                        If you have questions about our use of cookies, you may
                        contact Plantetto through our official support channels.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SettingsCookies;
