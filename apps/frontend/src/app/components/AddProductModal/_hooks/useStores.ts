import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Store } from '../_types';
import { api } from '@/lib/axios';

export const useStores = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchStores = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await api.get('/stores');
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
            toast.error('店舗情報の取得に失敗しました');
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        stores,
        isLoading,
        error,
        fetchStores,
    };
};