import { FC } from 'react';
import { DialogContainer } from './_components/DialogContainer';
import { ModalContent } from './_components/ModalContent';
import { useCamera } from './_hooks/useCamera';
import { useManualInput } from './_hooks/useManualInput';
import { ModalProps } from './_types';
import { CancelButton } from '../common/CancelButton';

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
      <div className="flex flex-co sm:flex-row sm:justify-center sm:items-center gap-3 pt-2">
        <CancelButton onClick={handleClose} />
      </div>
    </DialogContainer>
  );
};