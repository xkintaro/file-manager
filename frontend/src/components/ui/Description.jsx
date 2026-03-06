import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Description({ text, maxLength, showToggleButton = true, className }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const shouldTruncate = maxLength && text.length > maxLength;
    const displayText = shouldTruncate && !isExpanded ? `${text.slice(0, maxLength)}...` : text;

    return (
        <div className={twMerge(clsx("text-muted text-sm wrap-break-word", className))}>
            {displayText}
            {shouldTruncate && showToggleButton && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }}
                    className="ml-2 text-accent hover:text-white transition-colors focus:outline-none text-xs"
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    );
}
