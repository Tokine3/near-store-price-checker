import { motion } from 'framer-motion';
import Image from 'next/image';
import { ImageSquare, Barcode, PencilSimple } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';
type ProductInfoProps = {
    barcode: string;
    name: string;
    makerName?: string;
    brandName?: string;
    imageUrl: string;
    isEditing: boolean;
    onEditToggle: () => void;
    onNameChange: (value: string) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
    barcode,
    name,
    makerName,
    brandName,
    imageUrl,
    isEditing,
    onEditToggle,
    onNameChange,
}) => {
    const handleBlur = () => {
        if (isEditing) {
            onEditToggle();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 漢字変換や入力した日本語の確定を行うEnterキー入力は無視
        if (e.key === 'Enter' && e.nativeEvent.isComposing) {
            e.preventDefault();
            return;
        }
        
        // 入力確定後のEnterキーで検索実行
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onEditToggle();
        }
    };
    

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
                            src={imageUrl}
                            alt={name}
                            fill
                            sizes="(max-width: 96px) 100vw, 96px"
                            style={{ objectFit: 'contain' }}
                            className="rounded-lg shadow-sm bg-white"
                            onError={(e) => {
                                console.error('画像読み込みエラー:', imageUrl);
                                e.currentTarget.src = '';
                            }}
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
                    <div className="flex items-center gap-2 w-full min-w-0">
                    {isEditing ? (
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => onNameChange(e.target.value)}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                className={twMerge(
                                    "w-full min-w-0",
                                    "px-3 py-2",
                                    "text-base sm:text-lg font-medium text-gray-900",
                                    "bg-white",
                                    "border border-orange-100 rounded-lg",
                                    "outline-none",
                                    "focus:border-transparent",
                                    "focus:ring-2 focus:ring-orange-500/20",
                                    "transition-all duration-200"
                                )}
                                autoFocus
                            />
                        ) : (
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                                {name}
                            </h3>
                        )}
                        <button
                            type="button"
                            onClick={onEditToggle}
                            className={twMerge(
                                "p-1.5 rounded-lg",
                                "hover:bg-orange-50",
                                "transition-colors",
                                isEditing && "bg-orange-50"
                            )}
                        >
                            <PencilSimple
                                size={20}
                                weight="duotone"
                                color="#FB923C"
                            />
                        </button>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                        <Barcode weight="duotone" size={16} color="#FBBA74" />
                        <span>{barcode}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};