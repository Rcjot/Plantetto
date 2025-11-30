import React from "react";

interface SettingItemProps {
    icon: string;
    label: string;
    onClick: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-gray-100 transition w-full text-left"
        >
            <img src={icon} className="w-5 h-5" />
            <span className="text-base">{label}</span>
        </button>
    );
};

export default SettingItem;
