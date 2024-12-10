import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Store } from '../_types';

export const useStores = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchStores = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
        const response = await axios.get('http://localhost:8000/stores');
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