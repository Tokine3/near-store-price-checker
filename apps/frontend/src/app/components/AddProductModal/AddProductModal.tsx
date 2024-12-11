import { FC, useEffect, useState, useCallback } from 'react';
import { ModalHeader } from './_components/ModalHeader';
import { ModalContent } from './_components/ModalContent';
import { useStores, useProductPrice, useFormSubmit } from './_hooks';
import { AddProductModalProps } from './_types';
import { StoreRegistrationModal } from '../StoreRegistrationModal';
import { DialogContainer } from '../BarCodeReaderModal/_components';

export const AddProductModal: FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  makerName,
  brandName,
  name,
  barcode,
  imageUrl,
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

  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // 編集中の商品名
  const [editedName, setEditedName] = useState(name);
  // 初期の商品名を保存
  const [initializeName, setInitializeName] = useState(name);

  // 編集モードの切り替え
  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      // 編集モードを終了するとき、空白の場合のみ元の名前を復元
      if (!editedName.trim()) {
        setEditedName(initializeName);
      }
    }
    setIsEditing(!isEditing);
  }, [isEditing, editedName, initializeName]);

  // 商品名の更新
  const handleNameChange = useCallback((value: string) => {
    setEditedName(value);
  }, []);

  // フォーム送信時に編集した商品名を含める
  const { handleSubmit, handleClose, priceError } = useFormSubmit({
    selectedStoreId,
    price,
    onSubmit: async (data) => {
      await onSubmit({
        ...data,
        name: editedName,
      });
    },
    onClose,
    resetForm
  });

  // モーダルを開く際の初期化処理
  const initializeModal = useCallback(() => {
    fetchStores();
    resetForm();
    setIsEditing(false);
    setEditedName(name);
    setInitializeName(name);
  }, [fetchStores, resetForm, name]);

  // モーダルが開かれたときのみ初期名前をセット
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
  ]);

  return (
    <DialogContainer isOpen={isOpen} onClose={handleClose}>
      <ModalHeader isRegistered={isRegistered} />
      <ModalContent
        barcode={barcode}
        name={editedName}
        makerName={makerName}
        brandName={brandName}
        imageUrl={imageUrl}
        selectedStoreId={selectedStoreId}
        stores={stores}
        onStoreSelect={handleStoreSelect}
        price={price}
        onPriceChange={handlePriceChange}
        productStorePrice={productStorePrice}
        onStoreModalOpen={() => setIsStoreModalOpen(true)}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onNameChange={handleNameChange}
        priceError={priceError}
      />

      <StoreRegistrationModal
        isOpen={isStoreModalOpen}
        onClose={() => {
          setIsStoreModalOpen(false);
          fetchStores();
        }}
      />
    </DialogContainer>
  );
};