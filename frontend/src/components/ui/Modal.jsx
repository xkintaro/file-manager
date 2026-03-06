import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Modal({ isOpen, onClose, title, children, width = '600px' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isOpen]);

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative w-full max-w-full structural-panel overflow-hidden flex flex-col"
                        style={{ maxWidth: width }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-border bg-surface-hover">
                            <h2 className="text-2xl font-heading font-bold text-white m-0 uppercase tracking-tight">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-muted hover:text-white transition-colors ml-4 focus:outline-none cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}

export function ModalFooter({ children }) {
    return (
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
            {children}
        </div>
    );
}
