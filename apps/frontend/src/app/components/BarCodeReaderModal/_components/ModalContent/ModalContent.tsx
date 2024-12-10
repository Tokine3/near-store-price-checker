import { FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ModalHeader } from '../ModalHeader';
import { CloseButton } from '../CloseButton';
import { ModeToggleButton } from '../ModeToggleButton';
import { ManualInputForm } from '../ManualInputForm';
import { CameraView } from '../CameraView';
import { ModalContentProps } from '../../_types';

export const ModalContent: FC<ModalContentProps> = ({
    onClose,
    isManualMode,
    onModeToggle,
    manualBarcode,
    onBarcodeChange,
    onManualSubmit,
    cameraProps,
}) => {
    return (
        <>
        <CloseButton onClose={onClose} />
        <ModalHeader />
        
        <ModeToggleButton 
            isManualMode={isManualMode}
            onToggle={onModeToggle}
        />

        <AnimatePresence mode="wait">
            {isManualMode ? (
            <ManualInputForm
                manualBarcode={manualBarcode}
                onBarcodeChange={onBarcodeChange}
                onSubmit={onManualSubmit}
            />
            ) : (
            <CameraView {...cameraProps} />
            )}
        </AnimatePresence>
        </>
    );
};