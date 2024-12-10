export type ModalContentProps = {
    onClose: () => void;
    isManualMode: boolean;
    onModeToggle: () => void;
    manualBarcode: string;
    onBarcodeChange: (value: string) => void;
    onManualSubmit: (e: React.FormEvent) => void;
    cameraProps: {
        isLoading: boolean;
        hasPermission: boolean;
        shouldShowScanner: boolean;
        isManualMode: boolean;
        onDetected: (error: unknown, result?: BarcodeResult | null) => void;
    };
};

export type BarcodeResult = {
    barcodeNo: string;
}

export type ModalProps = {
    /** モーダルの表示状態 */
    isOpen: boolean;
    /** モーダルを閉じる関数 */
    onClose: () => void;
    /** バーコード検出時のコールバック */
    onDetected: (error: unknown, result?: BarcodeResult | null) => void;
}

export type CameraViewProps = {
    isLoading: boolean;
    hasPermission: boolean;
    shouldShowScanner: boolean;
    isManualMode: boolean;
    onDetected: (error: unknown, result?: BarcodeResult | null) => void;
}

export type ManualInputFormProps = {
    manualBarcode: string;
    onBarcodeChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}