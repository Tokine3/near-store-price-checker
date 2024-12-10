import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageSquare, Barcode } from '@phosphor-icons/react';

type ProductInfoProps = {
    barcode: string;
    name: string;
    makerName?: string;
    brandName?: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
    barcode,
    name,
    makerName,
    brandName,
}) => {
    return (
        <motion.div 
        className="bg-orange-50/50 rounded-xl p-3 sm:p-4 border border-orange-100"
        whileHover={{ backgroundColor: 'rgba(255, 237, 213, 0.4)' }}
        transition={{ duration: 0.2 }}
        >
        <div className="flex items-start gap-4">
            {/* 商品画像 */}
            <div className="relative w-24 h-24 flex-shrink-0">
            {barcode ? (
                <Image
                src={`https://image.jancodelookup.com/${barcode}`}
                alt={name}
                fill
                sizes="(max-width: 96px) 100vw, 96px"
                style={{ objectFit: 'contain' }}
                className="rounded-lg shadow-sm bg-white"
                />
            ) : (
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center border border-orange-100">
                <ImageSquare weight="duotone" size={40} color="#FDBA74" />
                </div>
            )}
            </div>

            {/* 商品詳細 */}
            <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap gap-1.5">
                {makerName && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {makerName}
                </span>
                )}
                {brandName && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {brandName}
                </span>
                )}
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">{name}</h3>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                <Barcode weight="duotone" size={16} color="#FBBA74" />
                <span>{barcode}</span>
            </div>
            </div>
        </div>
        </motion.div>
    );
};