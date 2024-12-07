import { type FC } from 'react';
import { Dialog } from '@headlessui/react';
import { type Result } from '@zxing/library';
import { useState, useEffect, useCallback } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Camera,
    X,
    Warning,
    Barcode,
    Keyboard
} from '@phosphor-icons/react';

type BarcodeResult = {
    barcodeNo: string;
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
    const [isManualMode, setIsManualMode] = useState(false);
    const [manualBarcode, setManualBarcode] = useState('');

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
        setManualBarcode('');
        setIsManualMode(false);
        onClose();
    }, [onClose]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualBarcode.trim()) {
            onDetected(null, { barcodeNo: manualBarcode.trim() });
            handleClose();
        }
    };

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
        <AnimatePresence>
            {isOpen && (
                <Dialog
                open={isOpen}
                onClose={handleClose}
                className="relative z-50"
                >
                    {/* オーバーレイ */}
                    <motion.div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        aria-hidden="true" 
                    />
            
            {/* モーダルコンテンツ */}
            <div className="fixed inset-0 flex items-start justify-center overflow-y-auto">
                <div className="w-full max-w-lg mx-auto mt-10 sm:mt-20 p-4">
                    <Dialog.Panel>
                    <motion.div
                        className={twMerge(
                            "relative w-full",
                            "bg-white rounded-2xl shadow-xl",
                            "p-4 sm:p-6",
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                      {/* 閉じるボタン */}
                      <motion.button
                        type="button"
                        onClick={handleClose}
                        className={twMerge(
                          "absolute -top-2 -right-2 z-10",
                          "p-2 rounded-full",
                          "bg-white text-gray-500",
                          "border border-orange-100",
                          "outline-none",
                          "hover:bg-orange-50",
                          "focus:border-transparent",
                          "focus:ring-2 focus:ring-orange-500/20",
                          "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
                          "transition-all duration-200",
                          "shadow-md"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="閉じる"
                      >
                        <X weight="bold" size={20} />
                      </motion.button>
    
                      {/* ヘッダー部分 */}
                      <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-orange-100">
                        <motion.div 
                          className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <div className="hidden sm:block">
                            <Camera 
                              size={28}
                              weight="duotone"
                              color="#FFFFFF"
                            />
                          </div>
                          <div className="sm:hidden">
                            <Camera 
                              size={24}
                              weight="duotone"
                              color="#FFFFFF"
                            />
                          </div>
                        </motion.div>
                        <motion.div 
                          className="flex flex-col items-center gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Dialog.Title className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                            バーコードをスキャン
                          </Dialog.Title>
                          <p className="text-xs sm:text-sm text-orange-600/70">
                            商品のバーコードをカメラにかざしてください
                          </p>
                        </motion.div>
                      </div>
    
                      {/* モード切替ボタン */}
                      <div className="flex justify-center mt-4 mb-4">
                        <motion.button
                          onClick={() => setIsManualMode(!isManualMode)}
                          className={twMerge(
                            "inline-flex items-center gap-2",
                            "px-4 py-2",
                            "bg-white",
                            "border border-orange-100",
                            "rounded-xl",
                            "text-sm font-medium",
                            "text-gray-700",
                            "hover:bg-orange-50",
                            "transition-colors"
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isManualMode ? (
                            <>
                              <Camera size={20} className="text-orange-400" />
                              カメラに切り替え
                            </>
                          ) : (
                            <>
                              <Keyboard size={20} className="text-orange-400" />
                              手動入力に切り替え
                            </>
                          )}
                        </motion.button>
                      </div>
    
                      {/* カメラビュー / マニュアル入力フォーム */}
                      <AnimatePresence mode="wait">
                        {isManualMode ? (
                          <motion.form
                            key="manual"
                            onSubmit={handleManualSubmit}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <label 
                                htmlFor="barcode" 
                                className="block text-sm font-medium text-gray-700"
                              >
                                バーコード番号を入力
                              </label>
                              <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                  <Barcode 
                                    size={20}
                                    weight="duotone"
                                    className="text-orange-400"
                                  />
                                </div>
                                <input
                                  id="barcode"
                                  type="text"
                                  value={manualBarcode}
                                  onChange={(e) => setManualBarcode(e.target.value)}
                                  className={twMerge(
                                    "block w-full",
                                    "pl-10 pr-3 py-2.5",
                                    "bg-white",
                                    "border border-gray-200",
                                    "rounded-xl",
                                    "text-gray-900",
                                    "placeholder:text-gray-400",
                                    "focus:border-orange-500",
                                    "focus:ring-2",
                                    "focus:ring-orange-500/20",
                                    "transition-colors"
                                  )}
                                  placeholder="バーコード番号を入力してください"
                                />
                              </div>
                            </div>
                            <motion.button
                              type="submit"
                              className={twMerge(
                                "w-full",
                                "px-4 py-2.5",
                                "bg-orange-500",
                                "text-white font-medium",
                                "rounded-xl",
                                "hover:bg-orange-600",
                                "transition-colors"
                              )}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              確定
                            </motion.button>
                          </motion.form>
                        ) : (
                          <motion.div 
                            key="camera"
                            className="relative w-full h-64 sm:h-80"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                          >
                            {isLoading && (
                              <motion.div 
                                className="absolute inset-0 flex flex-col items-center justify-center bg-orange-50/50 z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="animate-pulse mb-2">
                                  <Camera 
                                    size={32}
                                    weight="duotone"
                                    color="#FB923C"
                                  />
                                </div>
                                <p className="text-sm text-orange-600">カメラを起動しています...</p>
                              </motion.div>
                            )}
        
                            {!isLoading && !hasPermission && (
                              <motion.div 
                                className="absolute inset-0 flex flex-col items-center justify-center bg-orange-50/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="mb-2">
                                  <Warning 
                                    size={32}
                                    weight="duotone"
                                    color="#F87171"
                                  />
                                </div>
                                <p className="text-sm text-red-500">カメラへのアクセスが許可されていません</p>
                              </motion.div>
                            )}
        
                            {shouldShowScanner && hasPermission && !isManualMode && (
                              <motion.div 
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                  <BarcodeScannerComponent
                                    width="100%"
                                    height="100%"
                                    onUpdate={(error: unknown, result?: Result) => {
                                      if (result) {
                                        onDetected(error, { barcodeNo: result.getText() });
                                      } else {
                                        onDetected(error, null);
                                      }
                                    }}
                                    facingMode="environment"
                                  />
                                  <motion.div
                                    className="absolute inset-0 pointer-events-none"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                      <Barcode 
                                        size={64}
                                        weight="duotone"
                                        color="rgba(249,115,22,0.3)"
                                      />
                                    </div>
                                  </motion.div>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Dialog.Panel>
                </div>
              </div>
            </Dialog>
          )}
        </AnimatePresence>
      );
    };

export default BarCodeReaderModal;