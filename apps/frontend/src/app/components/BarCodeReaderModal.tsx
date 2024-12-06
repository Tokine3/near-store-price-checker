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
                    {/* 閉じるボタン */}
                    <button
                        type="button"
                        onClick={handleClose}
                        className={twMerge(
                        "absolute -top-2 -right-2",
                        "p-2 rounded-full",
                        "bg-white text-red-600",
                        "border border-red-200",
                        "outline-none",
                        "hover:bg-red-50",
                        "focus:border-transparent",
                        "focus:ring-1 focus:ring-red-500/30",
                        "focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]",
                        "transition-shadow duration-200",
                        "shadow-md"
                        )}
                        aria-label="閉じる"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>

                    {/* ヘッダー部分 */}
                    <div className="flex flex-col items-center gap-4 pb-6 mb-6 border-b border-gray-200">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                        <CameraIcon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                        <Dialog.Title className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                            バーコードをスキャン
                        </Dialog.Title>
                        <p className="text-sm text-gray-500">
                            商品のバーコードをカメラにかざしてください
                        </p>
                        </div>
                    </div>

                    {/* カメラビュー部分 */}
                    <div 
                        className={twMerge(
                        "relative w-full",
                        "bg-gray-50 rounded-xl",
                        "border border-gray-200",
                        "overflow-hidden",
                        "shadow-inner",
                        "h-64" // カメラビューの高さを増加
                        )}
                        role="region"
                        aria-label="カメラビュー"
                    >
                        {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
                            <CameraIcon className="w-8 h-8 text-gray-400 animate-pulse mb-2" />
                            <p className="text-sm text-gray-500">カメラを起動しています...</p>
                        </div>
                        )}

                        {!isLoading && !hasPermission && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
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