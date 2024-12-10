import { motion } from 'framer-motion';
import { Storefront, Plus } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';
import { ProductPrice } from '../../_types';

type ModalFooterProps = {
    onStoreModalOpen: () => void;
    onClose: () => void;
    productStorePrice: ProductPrice | null;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
    onStoreModalOpen,
    onClose,
    productStorePrice,
}) => {
    return (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
        <motion.button
            type="button"
            onClick={onStoreModalOpen}
            className={twMerge(
            "inline-flex items-center justify-center gap-2",
            "px-4 py-2.5",
            "bg-white text-gray-700",
            "border border-orange-100 rounded-xl",
            "outline-none",
            "hover:bg-orange-50",
            "focus:border-transparent",
            "focus:ring-2 focus:ring-orange-500/20",
            "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
            "transition-all duration-200"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Storefront weight="duotone" size={20} color="#FBBA74" />
            店舗追加
        </motion.button>

        <div className="flex gap-3 w-full sm:w-auto">
            <motion.button
            type="button"
            onClick={onClose}
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
            <motion.button
            type="submit"
            className={twMerge(
                "flex-1 sm:flex-initial",
                "inline-flex items-center justify-center gap-1.5",
                "px-4 py-2.5",
                "bg-orange-500 text-white",
                "border border-transparent rounded-xl",
                "outline-none",
                "hover:bg-orange-600",
                "focus:border-transparent",
                "focus:ring-2 focus:ring-orange-500/20",
                "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
                "transition-all duration-200"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            >
            <Plus weight="bold" size={20} />
            {productStorePrice ? '更新' : '登録'}
            </motion.button>
        </div>
        </div>
    );
};