import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

type UseStoreRegistrationProps = {
    onClose: () => void;
};

export const useStoreRegistration = ({ onClose }: UseStoreRegistrationProps) => {
    const [storeName, setStoreName] = useState('');

    const resetAndClose = useCallback(() => {
        setStoreName('');
        onClose();
    }, [onClose]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
        await axios.post('http://localhost:8000/stores', {
            name: storeName,
        });
        toast.success('店舗を追加しました');
        resetAndClose();
        } catch (error) {
        console.error('Error registering store:', error);
        toast.error('店舗の追加に失敗しました');
        }
    }, [storeName, resetAndClose]);

    return {
        storeName,
        setStoreName,
        handleSubmit,
        resetAndClose
    };
};