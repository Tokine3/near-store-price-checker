import { FC } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

type Props = {
    onClick: () => void;
};

export const CancelButton: FC<Props> = ({ onClick }) => (
    <motion.button
    type="button"
    onClick={onClick}
    className={twMerge(
        "flex-1 sm:flex-initial",
        "inline-flex items-center justify-center",
        "px-4 py-2.5",
        "bg-white text-gray-600",
        "border border-gray-200 rounded-xl",
        "outline-none",
        "hover:bg-gray-50",
        "focus:border-transparent",
        "focus:ring-2 focus:ring-red-500/20",
        "focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]",
        "transition-all duration-200"
    )}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    >
    キャンセル
    </motion.button>
)