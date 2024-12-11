import { FC } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlass } from '@phosphor-icons/react';

export const LoadingOverlay: FC = () => {
    return (
        <motion.div
        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        >
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center gap-4">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <MagnifyingGlass size={32} weight="duotone" color="#FB923C" />
            </motion.div>
            <p className="text-orange-600 text-center">
                バーコード番号から商品を探しています...
            </p>
            </div>
        </div>
        </motion.div>
    );
};