import { useState, useCallback } from 'react';
import { ProductPrice } from '../_types';
import { convertFullWidthToHalfWidth } from '@/app/utils/string';

export const useProductPrice = () => {
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [productStorePrice, setProductStorePrice] = useState<ProductPrice | null>(null);
    const [price, setPrice] = useState('');

    const handlePriceChange = useCallback((value: string) => {
        const convertedValue = convertFullWidthToHalfWidth(value);
        if (convertedValue === '' || /^\d+$/.test(convertedValue)) {
            setPrice(convertedValue);
        }
    }, []);

    // リセット関数をuseCallbackでメモ化
    const resetForm = useCallback(() => {
        setSelectedStoreId('');
        setPrice('');
        setProductStorePrice(null);
    }, []);

    return {
        selectedStoreId,
        setSelectedStoreId,
        productStorePrice,
        setProductStorePrice,
        price,
        handlePriceChange, // setPrice の代わりに handlePriceChange を返す
        resetForm,
    };
};