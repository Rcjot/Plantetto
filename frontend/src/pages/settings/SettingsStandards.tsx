import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function SettingsStandards() {
    return (
        <div className="flex flex-col gap-7 p-3 sm:p-10">
            <div className="flex gap-2 items-center">
                <Link to={"/settings"} className="self-start w-fit">
                    <ArrowLeft size={32} />
                </Link>

                {/* Page Title */}
                <h1 className="text-2xl font-bold">Community Standards</h1>
            </div>

            <div className="flex flex-col gap-6 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>
                    <span className="font-semibold">Plantetto</span> is a safe and
                    welcoming community for people who love plants and nature.
                    These Community Standards explain what is allowed on our
                    platform and what is not. By using Plantetto, you agree to
                    follow these rules.
                </p>

                {/* 1 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">1. Be Respectful</h2>
                    <p>
                        Treat everyone with respect. Harassment, bullying, hate
                        speech, threats, or personal attacks are not allowed in
                        any form.
                    </p>
                </div>

                {/* 2 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">2. Share Appropriate Content</h2>
                    <p>
                        Plantetto is focused on plants, flowers, gardening, and
                        nature-related content. Do not post explicit, violent,
                        or inappropriate material that does not align with the
                        purpose of our platform.
                    </p>
                </div>

                {/* 3 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">3. Authentic Identity</h2>
                    <p>
                        Do not pretend to be someone else. Impersonation,
                        fake accounts for deception, and identity misuse are
                        not allowed.
                    </p>
                </div>

                {/* 4 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">4. No Scams or Fraud</h2>
                    <p>
                        Scamming, fraudulent selling, fake giveaways, and
                        misleading transactions in the marketplace are strictly
                        prohibited.
                    </p>
                </div>

                {/* 5 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">5. Marketplace Responsibility</h2>
                    <p>
                        Sellers must provide honest product descriptions, fair
                        pricing, and lawful items. Buyers and sellers are
                        responsible for their own transactions.
                    </p>
                </div>

                {/* 6 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">6. Intellectual Property</h2>
                    <p>
                        Only post content that you own or have permission to
                        share. Do not steal photos, videos, guides, or other
                        creative works from others.
                    </p>
                </div>

                {/* 7 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">7. No Spam or Abuse</h2>
                    <p>
                        Do not post repetitive, misleading, or automated content.
                        Spamming, mass messaging, and fake engagement are not
                        allowed.
                    </p>
                </div>

                {/* 8 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">8. Safety & Harm Prevention</h2>
                    <p>
                        Do not promote harmful practices related to plants,
                        chemicals, or dangerous gardening methods that could
                        seriously injure others.
                    </p>
                </div>

                {/* 9 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">9. Reporting Violations</h2>
                    <p>
                        If you see content that violates these standards, you
                        may report it through our reporting tools. We review
                        reports and take action when necessary.
                    </p>
                </div>

                {/* 10 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">10. Enforcement Actions</h2>
                    <p>
                        Violating these Community Standards may result in content
                        removal, temporary restrictions, account suspension, or
                        permanent removal from Plantetto.
                    </p>
                </div>

                {/* 11 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">11. Updates to These Standards</h2>
                    <p>
                        We may update these Community Standards from time to time
                        to keep our community safe. Continued use of Plantetto
                        means you agree to any updates.
                    </p>
                </div>

                {/* 12 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">12. Contact Us</h2>
                    <p>
                        If you have questions about these standards or need help,
                        please contact Plantetto through our official support
                        channels.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SettingsStandards;
