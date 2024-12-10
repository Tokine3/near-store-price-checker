import { useState, useCallback, useEffect } from 'react';

export const useCamera = (isOpen: boolean) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [shouldShowScanner, setShouldShowScanner] = useState(false);

    const initializeCamera = useCallback(async () => {
        try {
            setIsLoading(true);
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' }
            });
            
            stream.getTracks().forEach(track => track.stop());
            
            setHasPermission(true);
            setShouldShowScanner(true);
        } catch (error) {
            console.error('Camera initialization error:', error);
            setHasPermission(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            initializeCamera();
        }
        
        return () => {
            setShouldShowScanner(false);
            setHasPermission(false);
        };
    }, [isOpen, initializeCamera]);

    return {
        isLoading,
        hasPermission,
        shouldShowScanner,
        setShouldShowScanner
    };
};