import { useState } from 'react';

type UseFormSubmitProps = {
    selectedStoreId: string;
    price: string;
    onSubmit: (data: { storeId: number; price: number }) => void;
    onClose: () => void;
    resetForm: () => void;
};

export const useFormSubmit = ({
    selectedStoreId,
    price,
    onSubmit,
    onClose,
    resetForm
}: UseFormSubmitProps) => {
    const [priceError, setPriceError] = useState('');

    const validateForm = () => {
        let isValid = true;
        
        // 価格のバリデーション
        if (!price || Number(price) <= 0) {
            setPriceError('価格を入力してください');
            isValid = false;
        } else {
            setPriceError('');
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit({
                storeId: Number(selectedStoreId),
                price: Number(price),
            });
            resetForm();
            onClose();
        } catch (error) {
            console.error('送信エラー:', error);
        }
    };

    return {
        handleSubmit,
        handleClose: onClose,
        priceError,
    };
};