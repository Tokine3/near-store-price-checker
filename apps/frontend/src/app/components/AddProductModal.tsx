import { Listbox, Transition } from '@headlessui/react';
import { BuildingStorefrontIcon, CalendarIcon, CheckIcon, ChevronUpDownIcon, CurrencyYenIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import Image from 'next/image';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import StoreRegistrationModal from './StoreRegistrationModal';
import dayjs from 'dayjs';



type Store = {
  id: string;
  name: string;
}

type ProductPrice = {
  id: number;
  price: number;
  store: {
    id: number;
    name: string;
  };
  updatedAt: string;
}

type Props = {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
  /** メーカー名 */
  makerName?: string;
  /** ブランド名 */
  brandName?: string;
  /** 商品名 */
  name: string;
  /** バーコード */
  barcode: string;
  /** 商品情報送信時のコールバック */
  onSubmit: (data: { storeId: number; price: number }) => void;
  /** 商品が登録済みかどうか */
  isRegistered?: boolean;
  /** スキャンした商品の価格情報 */
  scannedProduct?: ProductPrice[];
  /** 店舗選択時のコールバック */
  onStoreSelect?: (storeId: string) => void;
}

/**
 * 商品情報を追加・編集するモーダルコンポーネント
 * @description 商品の価格情報を店舗ごとに登録・更新できるモーダル
 */
const AddProductModal: React.FC<Props> = ({
  isOpen,
  onClose,
  makerName,
  brandName,
  name,
  barcode,
  onSubmit,
  isRegistered,
  scannedProduct,
  onStoreSelect = () => {},
}) => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [productStorePrice, setProductStorePrice] = useState<ProductPrice | null>(null);
  const [price, setPrice] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  console.log('scannedProduct', scannedProduct);

  useEffect(() => {
    if (!isOpen) return;
    
    fetchStores();
    resetForm();
  }, [isOpen]);

  const resetForm = () => {
    setSelectedStoreId('');
    setPrice('');
  };

  const fetchStores = async () => {
    try {
      const response = await axios.get('http://localhost:8000/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('店舗情報の取得に失敗しました');
    }
  };

  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
    onStoreSelect(storeId);

    const existingPrice = scannedProduct?.find(
      (productStore) => productStore.store.id === Number(storeId)
    );

    setProductStorePrice(existingPrice ?? null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNumber = Number(price);

    if (!selectedStoreId) {
      toast.error('店舗を選択してください');
      return;
    }
    
    if (priceNumber <= 0) {
      toast.error('価格が正しくありません');
      return;
    }
    
    onSubmit({
      storeId: parseInt(selectedStoreId),
      price: priceNumber,
    });
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleStoreModalClose = () => {
    setIsStoreModalOpen(false);
    fetchStores(); // 店舗モーダルが閉じられた後にストア情報を再取得
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={twMerge(
        "max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl",
        "sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      )}
      overlayClassName="fixed inset-0 bg-black/30"
      ariaHideApp={false}
    >
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {isRegistered ? '価格情報の追加' : '新規商品登録'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 商品情報表示部分 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-4">
              {/* 商品画像 */}
              <div className="relative w-24 h-24 flex-shrink-0">
                {barcode ? (
                  <Image
                    src={`https://image.jancodelookup.com/${barcode}`}
                    alt={name}
                    fill
                    sizes="(max-width: 96px) 100vw, 96px"
                    style={{ objectFit: 'contain' }}
                    className="rounded-lg shadow-sm bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* 商品詳細 */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  {makerName && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {makerName}
                    </span>
                  )}
                  {brandName && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {brandName}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">JANコード: {barcode}</p>
              </div>
            </div>
          </div>

          {/* 店舗選択 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              店舗を選択
            </label>
            <Listbox value={selectedStoreId} onChange={handleStoreSelect}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500">
                  <span className="block truncate text-base font-medium text-[#696969]">
                    {selectedStoreId
                      ? stores.find((store) => store.id === selectedStoreId)?.name
                      : '店舗を選択してください'}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                    {stores.map((store) => (
                      <Listbox.Option
                        key={store.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                          }`
                        }
                        value={store.id}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {store.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* 価格入力 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              価格
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <CurrencyYenIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={twMerge(
                  "w-full rounded-md border-gray-300",
                  "pl-10 py-2",
                  "text-base font-medium text-[#696969]",
                  "focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2",
                  "placeholder:text-base placeholder:font-medium placeholder:text-[#696969]",
                  "transition-colors duration-200",
                  "[appearance:textfield]",
                  "[&::-webkit-outer-spin-button]:appearance-none",
                  "[&::-webkit-inner-spin-button]:appearance-none"
                )}
                placeholder="0"
                required
              />
            </div>
            
            {/* 既存の価格情報表示 */}
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">現在の登録価格：</span>
                  <div className="flex items-center">
                    <CurrencyYenIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-base font-medium text-gray-900">
                      {productStorePrice ? productStorePrice.price.toLocaleString() : '-'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {productStorePrice && <CalendarIcon className="h-4 w-4 text-gray-400" />}
                  <span className="text-sm text-gray-500">
                    {productStorePrice ? dayjs(productStorePrice.updatedAt).format('YYYY/MM/DD') : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* フッター部分 */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setIsStoreModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-blue-500 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-gray-400" />
              店舗追加
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-500 bg-white border border-blue-500 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {productStorePrice ? '更新' : '登録'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 店舗追加モーダル */}
      <StoreRegistrationModal
        isOpen={isStoreModalOpen}
        onClose={handleStoreModalClose}
      />
    </Modal>
  );
};

export default AddProductModal;