import { type FC } from 'react';
import { Dialog } from '@headlessui/react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { type Result } from '@zxing/library';
import { useState, useEffect, useCallback } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { twMerge } from 'tailwind-merge';

type BarcodeResult = {
    text: string;
}

type Props = {
    /** モーダルの表示状態 */
    isOpen: boolean;
    /** モーダルを閉じる関数 */
    onClose: () => void;
    /** バーコード検出時のコールバック */
    onDetected: (error: unknown, result?: BarcodeResult | null) => void;
}

/**
 * バーコードリーダーモーダルコンポーネント
 * @description カメラを使用してバーコードをスキャンするモーダル
 */
const BarCodeReaderModal: FC<Props> = ({
    isOpen,
    onClose,
    onDetected,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [shouldShowScanner, setShouldShowScanner] = useState(false);

    const initializeCamera = useCallback(async () => {
    try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
        });
        
        // ストリームを停止してリソースを解放
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

    const handleClose = useCallback(() => {   
        setShouldShowScanner(false);
        setHasPermission(false);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
        initializeCamera();
    }
    
    return () => {
        setShouldShowScanner(false);
        setHasPermission(false);
    };
    }, [isOpen, initializeCamera]);

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            className="relative z-50"
        >
            <div 
            className="fixed inset-0 bg-black/30" 
            aria-hidden="true" 
            />
            
            <div className="fixed inset-0 flex items-start justify-center overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto mt-20 p-4">
                    <Dialog.Panel 
                        className={twMerge(
                            "relative w-full max-w-2xl",
                            "bg-white rounded-xl shadow-xl",
                            "p-6",
                            "transform transition-all",
                        )}
                    >
                        <button
                            type="button"
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="閉じる"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-500" />
                        </button>

                        <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                            バーコードをスキャン
                        </Dialog.Title>

                        <div 
                            className={twMerge(
                                "relative w-full h-48",
                                "bg-gray-100 rounded-lg",
                                "overflow-hidden"
                            )}
                            role="region"
                            aria-label="カメラビュー"
                        >
                            {isLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                                    <CameraIcon className="w-8 h-8 text-gray-400 animate-pulse mb-2" />
                                    <p className="text-sm text-gray-500">カメラを起動しています...</p>
                                </div>
                            )}

                            {!isLoading && !hasPermission && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                                    <CameraIcon className="w-8 h-8 text-red-400 mb-2" />
                                    <p className="text-sm text-red-500">カメラへのアクセスが許可されていません</p>
                                </div>
                            )}

                            {shouldShowScanner && hasPermission && (
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                        <BarcodeScannerComponent
                                            width="100%"
                                            height="100%"
                                            onUpdate={(error: unknown, result?: Result) => {
                                                if (result) {
                                                onDetected(error, { text: result.getText() });
                                                } else {
                                                onDetected(error, null);
                                                }
                                            }}
                                            facingMode="environment"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
};

export default BarCodeReaderModal;