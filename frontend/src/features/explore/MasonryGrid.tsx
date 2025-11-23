import React from "react";
import type { ReactNode } from "react";

interface MasonryGridProps {
    children: ReactNode;
    className?: string;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ children, className }) => {
    return (
        <div className={`masonry ${className || ""}`}>
            {children}
            <style>
                {`
          .masonry {
            column-count: 1;
            column-gap: 1rem;
          }
          @media (min-width: 640px) { .masonry { column-count: 2; } }
          @media (min-width: 768px) { .masonry { column-count: 3; } }
          @media (min-width: 1024px) { .masonry { column-count: 4; } }
          .masonry > * {
            break-inside: avoid;
            margin-bottom: 1rem;
          }
        `}
            </style>
        </div>
    );
};

export default MasonryGrid;
