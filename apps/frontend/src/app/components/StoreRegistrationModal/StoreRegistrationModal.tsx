import { FC } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { ModalProps } from './_types';
import { useStoreRegistration } from './_hooks';
import { modalAnimations, modalStyles } from './_styles';
import { CloseButton } from './_components/CloseButton';
import { ModalHeader } from './_components/ModalHeader';
import { StoreNameInput } from './_components/StoreNameInput';
import { FormActions } from './_components/FormActions';

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
    <Modal
      isOpen={isOpen}
      onRequestClose={resetAndClose}
      className={modalStyles.overlay}
      overlayClassName={modalStyles.overlay}
      ariaHideApp={false}
    >
      <motion.div 
        className={modalStyles.container}
        variants={modalAnimations.content}
        initial="initial"
        animate="animate"
        exit="exit"
      >
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
      </motion.div>
    </Modal>
  );
};