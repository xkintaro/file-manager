import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = forwardRef(({
    children,
    variant = 'primary',
    className,
    disabled,
    type = 'button',
    ...props
}, ref) => {

    const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-2.5 font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider";

    const variants = {
        primary: "bg-white text-black hover:bg-accent hover:text-black border border-transparent",
        secondary: "bg-surface hover:bg-surface-hover border border-border hover:border-border-focus text-white",
        danger: "bg-transparent hover:bg-error border border-error/50 hover:border-error text-error hover:text-white",
        success: "bg-transparent hover:bg-success border border-success/50 hover:border-success text-success hover:text-black",
    };

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled}
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';
