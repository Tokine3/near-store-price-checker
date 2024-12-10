import { FC } from 'react';
import { motion } from 'framer-motion';
import { Camera, Keyboard } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

type ModeToggleButtonProps = {
    isManualMode: boolean;
    onToggle: () => void;
}

export const ModeToggleButton: FC<ModeToggleButtonProps> = ({
    isManualMode,
    onToggle
}) => {
    return (
        <div className="flex justify-center mt-4 mb-4">
        <motion.button
            onClick={onToggle}
            className={twMerge(
            "inline-flex items-center gap-2",
            "px-4 py-2",
            "bg-white",
            "border border-orange-100",
            "rounded-xl",
            "text-sm font-medium",
            "text-gray-700",
            "hover:bg-orange-50",
            "transition-colors"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {isManualMode ? (
            <>
                <Camera size={20} color="#FB923C" />
                カメラに切り替え
            </>
            ) : (
            <>
                <Keyboard size={20} color="#FB923C" />
                手動入力に切り替え
            </>
            )}
        </motion.button>
        </div>
    );
};