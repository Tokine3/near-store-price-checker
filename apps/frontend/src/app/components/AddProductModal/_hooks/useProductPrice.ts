import { useState, useCallback } from 'react';
import { ProductPrice } from '../_types';

export const useProductPrice = () => {
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [productStorePrice, setProductStorePrice] = useState<ProductPrice | null>(null);
    const [price, setPrice] = useState('');

    // 価格変更のハンドラーをuseCallbackでメモ化
    const handlePriceChange = useCallback((value: string) => {
        // 数値以外の入力を防ぐ
        if (value === '' || /^\d+$/.test(value)) {
        setPrice(value);
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