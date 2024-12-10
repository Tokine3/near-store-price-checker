import { motion, AnimatePresence } from 'framer-motion';
import { CurrencyJpy, Calendar } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { ProductPrice } from '../../_types';

type PriceInputProps = {
    price: string;
    onPriceChange: (value: string) => void;
    selectedStoreId: string;
    productStorePrice: ProductPrice | null;
}

export const PriceInput: React.FC<PriceInputProps> = ({
    price,
    onPriceChange,
    selectedStoreId,
    productStorePrice,
}) => {
    return (
        <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
            価格
        </label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <CurrencyJpy weight="duotone" size={20} color="#FBBA74" />
            </div>
            <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className={twMerge(
                "w-full rounded-xl",
                "pl-10 py-2.5",
                "text-base font-medium text-gray-700",
                "bg-white",
                "border border-orange-100",
                "outline-none",
                "focus:border-transparent",
                "focus:ring-2 focus:ring-orange-500/20",
                "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
                "placeholder:text-gray-400",
                "transition-shadow duration-200",
                "[appearance:textfield]",
                "[&::-webkit-outer-spin-button]:appearance-none",
                "[&::-webkit-inner-spin-button]:appearance-none",
                "shadow-sm"
            )}
            placeholder="0"
            required
            />
        </div>

        <AnimatePresence>
            {selectedStoreId && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 mt-2"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-600">現在の登録価格：</span>
                    <div className="flex items-center">
                    <CurrencyJpy weight="duotone" size={16} color="#F97326" />
                    <span className="text-base font-medium text-gray-900">
                        {productStorePrice ? productStorePrice.price.toLocaleString() : '-'}
                    </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {productStorePrice && <Calendar weight="duotone" size={16} color="#FBBA74" />}
                    <span className="text-sm text-gray-500">
                    {productStorePrice ? dayjs(productStorePrice.updatedAt).format('YYYY/MM/DD') : ''}
                    </span>
                </div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    );
};