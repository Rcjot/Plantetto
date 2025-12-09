import React from "react";

interface SettingItemProps {
    children: React.ReactNode;
    label: string;
    onClick: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
    children,
    label,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-gray-200 transition w-full text-left cursor-pointer"
        >
            {children}
            <span className="text-base">{label}</span>
        </button>
    );
};

export default SettingItem;