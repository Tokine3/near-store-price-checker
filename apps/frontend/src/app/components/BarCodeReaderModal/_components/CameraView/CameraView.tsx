import { FC } from 'react';
import { motion } from 'framer-motion';
import { Result } from '@zxing/library';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Barcode } from '@phosphor-icons/react';
import { CameraViewProps } from '../../_types/types';
import { LoadingView } from '../LoadingView';
import { PermissionDeniedView } from '../PermissionDeniedView';

export const CameraView: FC<CameraViewProps> = ({
    isLoading,
    hasPermission,
    shouldShowScanner,
    isManualMode,
    onDetected
}) => {
    return (
        <motion.div 
        key="camera"
        className="relative w-full h-64 sm:h-80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        >
        {isLoading && <LoadingView />}
        {!isLoading && !hasPermission && <PermissionDeniedView />}
        
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
    );
};