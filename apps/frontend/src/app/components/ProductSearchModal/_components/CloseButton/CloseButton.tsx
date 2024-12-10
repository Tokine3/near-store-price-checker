import { FC } from 'react';
import { motion } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

type CloseButtonProps = {
    onClose: () => void;
};

export const CloseButton: FC<CloseButtonProps> = ({ onClose }) => {
    return (
        <motion.button
        type="button"
        onClick={onClose}
        className={twMerge(
            "absolute -top-2 -right-2 z-10",
            "p-2 rounded-full",
            "bg-white text-gray-500",
            "border border-orange-100",
            "outline-none",
            "hover:bg-orange-50",
            "focus:border-transparent",
            "focus:ring-2 focus:ring-orange-500/20",
            "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
            "transition-all duration-200",
            "shadow-md"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="閉じる"
        >
        <X weight="bold" size={20} />
        </motion.button>
    );
};