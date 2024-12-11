import { FC } from 'react';
import { motion } from 'framer-motion';
import { User } from '@phosphor-icons/react';
import { modalAnimations } from '../../_styles/animations';

export const ModalHeader: FC = () => {
    return (
        <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-orange-100">
            <motion.div 
                className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg"
                variants={modalAnimations.icon}
                initial="initial"
                animate="animate"
            >
                <User size={28} weight="duotone" color="#FFFFFF" />
            </motion.div>
            <motion.div 
                className="flex flex-col items-center gap-1"
                variants={modalAnimations.text}
                initial="initial"
                animate="animate"
            >
                <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                    ユーザー登録
                </h2>
                <p className="text-xs sm:text-sm text-orange-600/70">
                    あなたの名前を入力してください
                </p>
            </motion.div>
        </div>
    );
};