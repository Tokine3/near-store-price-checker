import { FC, useEffect, useState, useCallback } from 'react';
import Modal from 'react-modal';
import { ModalHeader } from './_components/ModalHeader';
import { ModalContent } from './_components/ModalContent';
import { useStores, useProductPrice, useFormSubmit } from './_hooks';
import { AddProductModalProps } from './_types';
import { modalClassNames } from './_components/_styles';
import { StoreRegistrationModal } from '../StoreRegistrationModal';

export const AddProductModal: FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  makerName,
  brandName,
  name,
  barcode,
  onSubmit,
  isRegistered,
  scannedProduct,
  onStoreSelect: onStoreSelectProp = () => {},
}) => {
  const { stores, fetchStores } = useStores();
  const {
    selectedStoreId,
    setSelectedStoreId,
    productStorePrice,
    setProductStorePrice,
    price,
    handlePriceChange,
    resetForm
  } = useProductPrice();

  const formSubmit = useFormSubmit({
    selectedStoreId,
    price,
    onSubmit,
    onClose,
    resetForm
  });
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  // モーダルを開く際の初期化処理をuseCallbackでメモ化
  const initializeModal = useCallback(() => {
    fetchStores();
    resetForm();
  }, [fetchStores, resetForm]);

  useEffect(() => {
    if (!isOpen) return;
    initializeModal();
  }, [isOpen, initializeModal]);

  const handleStoreSelect = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
    onStoreSelectProp(storeId);

    const existingPrice = scannedProduct?.prices?.find(
      (productStore) => productStore.store.id === Number(storeId)
    );

    setProductStorePrice(existingPrice ?? null);
  }, [
    setSelectedStoreId,
    setProductStorePrice,
    onStoreSelectProp,
    scannedProduct?.prices
  ]);  // 必要な関数のみを依存配列に追加

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={formSubmit.handleClose}
      className={modalClassNames.container}
      overlayClassName={modalClassNames.overlay}
      ariaHideApp={false}
    >
      <ModalHeader isRegistered={isRegistered} />
      <ModalContent
        barcode={barcode}
        name={name}
        makerName={makerName}
        brandName={brandName}
        selectedStoreId={selectedStoreId}
        stores={stores}
        onStoreSelect={handleStoreSelect}
        price={price}
        onPriceChange={handlePriceChange}
        productStorePrice={productStorePrice}
        onStoreModalOpen={() => setIsStoreModalOpen(true)}
        onClose={formSubmit.handleClose}
        onSubmit={formSubmit.handleSubmit}
      />

      <StoreRegistrationModal
        isOpen={isStoreModalOpen}
        onClose={() => {
          setIsStoreModalOpen(false);
          fetchStores();
        }}
      />
    </Modal>
  );
};