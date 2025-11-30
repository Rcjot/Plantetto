import React from "react";

interface Props {
    title: string;
    onClose: () => void;
}

const ChangeEmailModal: React.FC<Props> = ({ title, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-lg p-8 rounded-3xl shadow-md border border-gray-300">

                {/* Title */}
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                    {title}
                </h2>

                {/* Inputs */}
                <div className="flex flex-col gap-5">
                    <input
                        type="email"
                        placeholder="Current Email Address"
                        className="w-full px-4 py-4 border border-gray-400 rounded-xl text-gray-600 text-base
                                   focus:ring-2 focus:ring-green-400 outline-none"
                    />

                    <input
                        type="email"
                        placeholder="New Email Address"
                        className="w-full px-4 py-4 border border-gray-400 rounded-xl text-gray-600 text-base
                                   focus:ring-2 focus:ring-green-400 outline-none"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        className="flex-1 py-3 rounded-xl bg-green-300 hover:bg-green-400 
                                   text-gray-900 font-medium text-lg"
                    >
                        Change Email
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 
                                   text-gray-800 font-medium text-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeEmailModal;
