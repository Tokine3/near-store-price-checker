import { Dialog } from '@headlessui/react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Result } from '@zxing/library';
import React, { useState, useEffect, useCallback } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { twMerge } from 'tailwind-merge';

interface BarcodeResult {
    text: string;
}

interface BarcodeReaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDetected: (error: unknown, result?: BarcodeResult | null) => void;
}

const BarcodeReaderModal: React.FC<BarcodeReaderModalProps> = ({
    isOpen,
    onClose,
    onDetected,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    // カメラの初期化
    const initializeCamera = useCallback(async () => {
        try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
        });
        
        // ストリームを停止
        stream.getTracks().forEach(track => track.stop());
        
        setHasPermission(true);
        setShowScanner(true);
        setIsLoading(false);
        } catch (error) {
        console.error('Camera error:', error);
        setHasPermission(false);
        setIsLoading(false);
        }
    }, []);

    // モーダルを閉じるときの処理
    const handleClose = useCallback(() => {
        setShowScanner(false);
        setHasPermission(false);
        onClose();
    }, [onClose]);

    // モーダルが開いたときにカメラを初期化
    useEffect(() => {
        if (isOpen) {
        initializeCamera();
        }
        return () => {
        setShowScanner(false);
        setHasPermission(false);
        };
    }, [isOpen, initializeCamera]);

    return (
        <Dialog
        open={isOpen}
        onClose={handleClose}
        className="relative z-50"
        >
            {/* オーバーレイ */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            {/* モーダルコンテナ */}
            <div className="fixed inset-0 flex items-start justify-center overflow-y-auto">
                <div className="w-full max-w-2xl mx-auto mt-20 p-4">
                    <Dialog.Panel className={twMerge(
                        "relative",
                        "w-full max-w-2xl",
                        "bg-white rounded-xl shadow-xl",
                        "p-6",
                        "transform transition-all",
                        )}>
                        <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-gray-500" />
                        </button>
                        <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                        バーコードをスキャン
                        </Dialog.Title>
                            <div className={twMerge(
                                "relative",
                                "w-full",
                                "h-48",
                                "bg-gray-100",
                                "rounded-lg",
                                "overflow-hidden",
                                "mb-4"
                            )}>
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
                                {showScanner && hasPermission && (
                                    <div className="absolute inset-0">
                                        {/* カメラビュー */}
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

                                        {/* スキャンガイドライン */}
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {/* ガイドエリア全体のコンテナ */}
                                                <div className="relative">
                                                    {/* 横線 */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                        <div className="w-48 h-[2px]" style={{ backgroundColor: '#696969' }} />
                                                    </div>

                                                    {/* 縦線 */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                        <div className="h-16 w-[2px]" style={{ backgroundColor: '#696969' }} />
                                                    </div>

                                                    {/* スキャンエリアのフレーム */}
                                                    <div className="relative w-64 h-32">
                                                        {/* 左上 */}
                                                        <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2" style={{ borderColor: '#696969' }} />
                                                        {/* 右上 */}
                                                        <div className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2" style={{ borderColor: '#696969' }} />
                                                        {/* 左下 */}
                                                        <div className="absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-2 border-l-2" style={{ borderColor: '#696969' }} />
                                                        {/* 右下 */}
                                                        <div className="absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2" style={{ borderColor: '#696969' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex justify-center">
                                <button
                                type="button"
                                onClick={handleClose}
                                className="inline-flex justify-center px-6 py-2 text-sm font-medium text-blue-500 bg-white border border-blue-500 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    キャンセル
                                </button>
                            </div>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
};

export default BarcodeReaderModal;