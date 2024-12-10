import { FormEvent } from 'react';
import { messages } from '../_components/_constants/message';
import { toast } from 'react-toastify';


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
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const priceNumber = Number(price);

        if (!selectedStoreId) {
        toast.error(messages.errors.storeRequired);
        return;
        }
        
        if (priceNumber <= 0) {
        toast.error(messages.errors.invalidPrice);
        return;
        }
        
        onSubmit({
        storeId: parseInt(selectedStoreId),
        price: priceNumber,
        });
        handleClose();
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return { handleSubmit, handleClose };
};