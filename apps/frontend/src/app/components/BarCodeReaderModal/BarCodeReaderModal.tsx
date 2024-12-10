import { FC } from 'react';
import { DialogContainer } from './_components/DialogContainer';
import { ModalContent } from './_components/ModalContent';
import { useCamera } from './_hooks/useCamera';
import { useManualInput } from './_hooks/useManualInput';
import { ModalProps } from './_types';

export const BarCodeReaderModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  onDetected,
}) => {
  const { isLoading, hasPermission, shouldShowScanner } = useCamera(isOpen);
  const {
    isManualMode,
    manualBarcode,
    handleBarcodeChange,
    handleSubmit,
    handleModeToggle,
    handleClose
  } = useManualInput({
    onDetected,
    onClose
  });

  const cameraProps = {
    isLoading,
    hasPermission,
    shouldShowScanner,
    isManualMode,
    onDetected
  };

  return (
    <DialogContainer isOpen={isOpen} onClose={handleClose}>
      <ModalContent
        onClose={handleClose}
        isManualMode={isManualMode}
        onModeToggle={handleModeToggle}
        manualBarcode={manualBarcode}
        onBarcodeChange={handleBarcodeChange}
        onManualSubmit={handleSubmit}
        cameraProps={cameraProps}
      />
    </DialogContainer>
  );
};