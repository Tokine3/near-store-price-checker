import { FC } from 'react';
import { motion } from 'framer-motion';
import { Barcode } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';
import { ManualInputFormProps } from '../../_types/types';
import { modalStyles } from '../../_styles';

export const ManualInputForm: FC<ManualInputFormProps> = ({
    manualBarcode,
    onBarcodeChange,
    onSubmit
}) => {
    return (
        <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4"
        >
        <div className="space-y-2">
            <label 
            htmlFor="barcode" 
            className="block text-sm font-medium text-gray-700"
            >
            バーコード番号を入力
            </label>
            <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Barcode 
                size={20}
                weight="duotone"
                color="#FB923C" 
                />
            </div>
            <input
                id="barcode"
                type="text"
                value={manualBarcode}
                onChange={(e) => onBarcodeChange(e.target.value)}
                className={modalStyles.input}
                placeholder="バーコード番号を入力してください"
            />
            </div>
        </div>
        <motion.button
            type="submit"
            className={twMerge(
            "w-full",
            "px-4 py-2.5",
            "bg-orange-500",
            "text-white font-medium",
            "rounded-xl",
            "hover:bg-orange-600",
            "transition-colors"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            確定
        </motion.button>
        </motion.form>
    );
};