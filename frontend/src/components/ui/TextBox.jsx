import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const TextBox = forwardRef(({
    className,
    width,
    height,
    style,
    ...props
}, ref) => {
    return (
        <input
            ref={ref}
            className={twMerge(
                clsx(
                    "w-full px-4 py-2.5 bg-background border border-border rounded-none",
                    "text-white placeholder:text-muted/50 font-mono text-sm",
                    "focus:outline-none focus:border-accent focus:bg-accent/5",
                    "transition-colors duration-200",
                    className
                )
            )}
            style={{ width, height, ...style }}
            {...props}
        />
    );
});

TextBox.displayName = 'TextBox';
