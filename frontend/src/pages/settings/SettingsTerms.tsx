import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function SettingsTerms() {
    return (
        <div className="flex flex-col gap-7 p-3 sm:p-10">
            <div className="flex gap-2 items-center">
                <Link to={"/settings"} className="self-start w-fit">
                    <ArrowLeft size={32} />
                </Link>

                {/* Page Title */}
                <h1 className="text-2xl font-bold">Terms of Service</h1>
            </div>

            <div className="flex flex-col gap-6 text-gray-700 text-sm sm:text-base leading-relaxed">
                <p>
                    Welcome to <span className="font-semibold">Plantetto</span>.
                    By creating an account, accessing, or using our services,
                    you agree to these Terms of Service. If you do not agree,
                    please do not use Plantetto.
                </p>

                {/* 1 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">1. About Plantetto</h2>
                    <p>
                        Plantetto is a social platform designed for plant lovers.
                        Users can share photos and videos of plants and flowers,
                        post stories (diaries), sell plants in the marketplace,
                        publish plant care guides, explore trending posts, and
                        connect with other users.
                    </p>
                </div>

                {/* 2 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">2. Eligibility</h2>
                    <p>
                        You must be at least 13 years old to use Plantetto. By
                        creating an account, you confirm that the information
                        you provide is accurate and that you are legally
                        allowed to use our services.
                    </p>
                </div>

                {/* 3 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">3. Your Account</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>You are responsible for maintaining your account security.</li>
                        <li>You must not share your password with others.</li>
                        <li>You are responsible for all activities under your account.</li>
                        <li>Plantetto may suspend or terminate accounts that violate our rules.</li>
                    </ul>
                </div>

                {/* 4 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">4. Content You Post</h2>
                    <p>
                        You own the content you post on Plantetto, including
                        photos, videos, stories, guides, and marketplace posts.
                        However, by posting content, you grant Plantetto a
                        non-exclusive, royalty-free license to display, share,
                        and distribute your content within the platform.
                    </p>
                </div>

                {/* 5 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">5. Prohibited Activities</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Posting illegal, harmful, or misleading content</li>
                        <li>Harassment, hate speech, or threats</li>
                        <li>Scamming, fraud, or false selling activities</li>
                        <li>Spamming or automated abuse</li>
                        <li>Violating intellectual property rights</li>
                    </ul>
                </div>

                {/* 6 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">6. Marketplace Rules</h2>
                    <p>
                        Plantetto provides a platform for users to sell plants
                        and related items. Sellers are responsible for product
                        accuracy, legality, pricing, and delivery. Plantetto is
                        not responsible for disputes between buyers and sellers.
                    </p>
                </div>

                {/* 7 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">7. Guides & Educational Content</h2>
                    <p>
                        Guides posted on Plantetto are for informational
                        purposes only. Plantetto does not guarantee the
                        accuracy, effectiveness, or safety of any guide shared
                        by users.
                    </p>
                </div>

                {/* 8 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">8. Service Availability</h2>
                    <p>
                        We strive to keep Plantetto available at all times, but
                        we do not guarantee uninterrupted access. We may modify,
                        suspend, or discontinue any part of the service at any
                        time.
                    </p>
                </div>

                {/* 9 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">9. Privacy</h2>
                    <p>
                        Your privacy is important to us. Our use of your data is
                        explained in our Privacy Policy. By using Plantetto, you
                        agree to the collection and use of information as
                        described there.
                    </p>
                </div>

                {/* 10 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">10. Termination</h2>
                    <p>
                        Plantetto may suspend or permanently remove your account
                        if you violate these Terms, Community Standards, or any
                        applicable laws.
                    </p>
                </div>

                {/* 11 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">11. Changes to These Terms</h2>
                    <p>
                        We may update these Terms from time to time. Continued
                        use of Plantetto after changes means you accept the
                        updated Terms.
                    </p>
                </div>

                {/* 12 */}
                <div>
                    <h2 className="font-bold text-lg mb-2">12. Contact Us</h2>
                    <p>
                        If you have questions or concerns about these Terms,
                        please contact Plantetto through our official support
                        channels.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SettingsTerms;
