import { FC } from 'react';
import { motion } from 'framer-motion';
import { ModalProps } from './_types';
import { useStoreRegistration } from './_hooks';
import { modalAnimations } from './_styles';
import { CloseButton } from './_components/CloseButton';
import { ModalHeader } from './_components/ModalHeader';
import { StoreNameInput } from './_components/StoreNameInput';
import { FormActions } from './_components/FormActions';
import { DialogContainer } from '../BarCodeReaderModal/_components';

export const StoreRegistrationModal: FC<ModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    storeName,
    setStoreName,
    handleSubmit,
    resetAndClose
  } = useStoreRegistration({ onClose });

  return (
    <DialogContainer isOpen={isOpen} onClose={resetAndClose}>
        <CloseButton onClose={resetAndClose} />
        <ModalHeader />
        <motion.form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:gap-6"
          variants={modalAnimations.form}
          initial="initial"
          animate="animate"
        >
          <StoreNameInput
            storeName={storeName}
            onChange={setStoreName}
          />
          <FormActions onCancel={resetAndClose} />
        </motion.form>
    </DialogContainer>
  );
};