import { FC } from 'react';
import { motion } from 'framer-motion';
import { ProductInfo } from '../ProductInfo';
import { StoreSelect } from '../StoreSelect';
import { PriceInput } from '../PriceInput';
import { ModalFooter } from '../ModalFooter';
import { Store, ProductPrice } from '../../_types';
import { modalAnimations } from '../_styles/animations';

type ModalContentProps = {
    barcode: string;
    name: string;
    makerName?: string;
    brandName?: string;
    imageUrl: string;
    selectedStoreId: string;
    stores: Store[];
    onStoreSelect: (storeId: string) => void;
    price: string;
    onPriceChange: (value: string) => void;
    productStorePrice: ProductPrice | null;
    onStoreModalOpen: () => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ModalContent: FC<ModalContentProps> = ({
    barcode,
    name,
    makerName,
    brandName,
    selectedStoreId,
    stores,
    imageUrl,
    onStoreSelect,
    price,
    onPriceChange,
    productStorePrice,
    onStoreModalOpen,
    onClose,
    onSubmit,
}) => {
    return (
        <motion.div 
        className="flex flex-col gap-4 sm:gap-6"
        {...modalAnimations.container}
        >
        <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:gap-6">
            <ProductInfo
            barcode={barcode}
            name={name}
            makerName={makerName}
            brandName={brandName}
            imageUrl={imageUrl}
            />

            <StoreSelect
            selectedStoreId={selectedStoreId}
            stores={stores}
            onStoreSelect={onStoreSelect}
            />

            <PriceInput
            price={price}
            onPriceChange={onPriceChange}
            selectedStoreId={selectedStoreId}
            productStorePrice={productStorePrice}
            />

            <ModalFooter
            onStoreModalOpen={onStoreModalOpen}
            onClose={onClose}
            productStorePrice={productStorePrice}
            />
        </form>
        </motion.div>
    );
};