import { useState, useCallback } from 'react';
import { BarcodeResult } from '../_types';

type UseManualInputProps = {
    onDetected: (error: unknown, result?: BarcodeResult | null) => void;
    onClose: () => void;
}

export const useManualInput = ({ onDetected, onClose }: UseManualInputProps) => {
    const [isManualMode, setIsManualMode] = useState(false);
    const [manualBarcode, setManualBarcode] = useState('');

    const handleBarcodeChange = useCallback((value: string) => {
        if (value === '' || /^\d+$/.test(value)) {
            setManualBarcode(value);
        }
    }, []);

    // handleCloseを先に定義
    const handleClose = useCallback(() => {
        setIsManualMode(false);
        setManualBarcode('');
        onClose();
    }, [onClose]);

    // handleSubmitの依存配列にhandleCloseを追加
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (manualBarcode.trim()) {
            onDetected(null, { barcodeNo: manualBarcode.trim() });
            handleClose();
        }
    }, [manualBarcode, onDetected, handleClose]);

    const handleModeToggle = useCallback(() => {
        setIsManualMode(prev => !prev);
    }, []);

    return {
        isManualMode,
        manualBarcode,
        handleBarcodeChange,
        handleSubmit,
        handleModeToggle,
        handleClose
    };
};