import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export const Checkbox = forwardRef(({ checked, onChange, id, className, ...props }, ref) => {
    return (
        <div className={twMerge(clsx("relative flex items-center justify-center w-5 h-5 cursor-pointer shrink-0", className))}>
            <input
                type="checkbox"
                id={id}
                ref={ref}
                checked={checked}
                onChange={onChange}
                className="absolute opacity-0 w-full h-full cursor-pointer z-10 m-0"
                {...props}
            />
            <div className={clsx(
                "w-full h-full border-2 rounded-md transition-colors duration-300 flex items-center justify-center",
                checked ? "border-accent bg-accent" : "border-border bg-transparent group-hover:border-muted"
            )}>
                {checked && (
                    <motion.svg
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-3.5 h-3.5 text-white pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                )}
            </div>
        </div>
    );
});

Checkbox.displayName = 'Checkbox';
