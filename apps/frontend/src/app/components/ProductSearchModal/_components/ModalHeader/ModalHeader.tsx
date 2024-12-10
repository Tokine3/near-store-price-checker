import { FC } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlass } from '@phosphor-icons/react';

export const ModalHeader: FC = () => {
    return (
        <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-orange-100">
        <motion.div 
            className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
            <div className="hidden sm:block">
            <MagnifyingGlass 
                size={28}
                weight="duotone"
                color="#FFFFFF"
            />
            </div>
            <div className="sm:hidden">
            <MagnifyingGlass 
                size={24}
                weight="duotone"
                color="#FFFFFF"
            />
            </div>
        </motion.div>
        <motion.div 
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
            商品検索
            </h2>
            <p className="text-xs sm:text-sm text-orange-600/70">
            商品名を入力してください
            </p>
        </motion.div>
        </div>
    );
};