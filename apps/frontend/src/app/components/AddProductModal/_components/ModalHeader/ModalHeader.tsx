import { motion } from 'framer-motion';
import { Storefront } from '@phosphor-icons/react';
import { FC } from 'react';
import { headerAnimations } from '../_styles/animations';

type ModalHeaderProps = {
    isRegistered: boolean;
}

export const ModalHeader: FC<ModalHeaderProps> = ({ isRegistered }) => {
    return (
        <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-orange-100">
        <motion.div 
            className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg"
            {...headerAnimations.icon}
        >
            <div className="hidden sm:block">
            <Storefront size={28} weight="duotone" color="#FFFFFF" />
            </div>
            <div className="sm:hidden">
            <Storefront size={24} weight="duotone" color="#FFFFFF" />
            </div>
        </motion.div>
        
        <motion.div 
            className="flex flex-col items-center gap-1"
            {...headerAnimations.text}
        >
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
            {isRegistered ? '価格情報の追加' : '新規商品登録'}
            </h2>
            <p className="text-xs sm:text-sm text-orange-600/70">
            {isRegistered ? '商品の価格情報を更新します' : '新しい商品を登録します'}
            </p>
        </motion.div>
        </div>
    );
};