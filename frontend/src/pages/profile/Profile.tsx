import { useParams } from "react-router-dom";

function Profile() {
    const { id } = useParams();
    return (
        <div className="bg-base-200 h-screen overflow-y-auto">
            <div className="bg-base-100">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            {/* pfp */}
                            <div className="avatar">
                                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"></div>
                            </div>

                            {/* prof info */}
                            <div>
                                <h1 className="text-2xl font-bold text-base-content">
                                    bingus dingus {id}
                                </h1>
                                <p className="text-base-content/70">
                                    @tyrone_byrone
                                </p>
                                <p className="text-sm text-base-content/60">
                                    2 followers 1 following
                                </p>
                            </div>
                        </div>

                        {/* no function yet for changing into edit profile cuz backend broken */}
                        <button className="btn btn-sm btn-neutral">
                            follow
                        </button>
                    </div>

                    {/* circle thing container */}
                    <div className="bg-base-200 border border-base-300 rounded-lg p-4 h-32 flex items-center justify-center">
                        <p className="text-base-content/40">
                            circle things container
                        </p>
                    </div>
                </div>
            </div>

            {/* nav tab*/}
            <div className="bg-base-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-success text-success-content rounded-lg overflow-hidden">
                        <div className="grid grid-cols-3">
                            {/* no function yet, ill fix it later */}
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral">
                                Posts
                            </button>
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral">
                                Plants
                            </button>
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral">
                                Guides
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* feed container (not my problem for now), maybe use useState to change content*/}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-base-100 rounded-lg border border-base-300 p-6 min-h-96 flex items-center justify-center">
                    <p className="text-base-content/40">
                        feed blah blah lbla AAAAA
                    </p>
                </div>
            </div>
            {/* temporary scroll fix (if removed, when you scroll down, there is no extra space making it look weird) */}
            <div className="h-16"></div>
        </div>
    );
}

export default Profile;
