import { Listbox, Transition } from '@headlessui/react';
import axios from 'axios';
import Image from 'next/image';
import React, { Fragment, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import StoreRegistrationModal from './StoreRegistrationModal';
import dayjs from 'dayjs';
import { ScannedProduct } from '../pages';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CurrencyJpy,
  Calendar,
  Tag,
  CaretDown,
  Plus,
  Storefront,
  Barcode,
  ImageSquare
} from '@phosphor-icons/react';



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
  /** 商品情報信時のコールバック */
  onSubmit: (data: { storeId: number; price: number }) => void;
  /** 商品が登録済みかどうか */
  isRegistered?: boolean;
  /** スキャンした商品の価格情報 */
  scannedProduct: ScannedProduct | null;
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

    console.log('scannedProduct at handleStoreSelect', scannedProduct);

    const existingPrice = scannedProduct?.prices?.find(
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
        "w-full max-w-md mx-auto",
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", // 中央配置
        "max-h-[90vh]", // 画面の90%の高さを最大値に
        "overflow-y-auto", // スクロール可能に
        "bg-white rounded-2xl shadow-xl",
        "p-4 sm:p-6",
        "sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      )}
      overlayClassName={twMerge(
        "fixed inset-0",
        "bg-black/30 backdrop-blur-sm",
        "overflow-y-auto", // オーバーレイもスクロール可能に
        "flex items-center justify-center", // フレックスボックスで中央寄せ
        "p-4" // パディングを追加してモバイルでの見切れを防ぐ
      )}
      ariaHideApp={false}
    >
      <motion.div 
        className="flex flex-col gap-4 sm:gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* ヘッダー部分 */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-orange-100">
          <motion.div 
            className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <>
              <div className="hidden sm:block">
                <Storefront 
                  size={28}
                  weight="duotone"
                  color="#FFFFFF"
                />
              </div>
              <div className="sm:hidden">
                <Storefront 
                  size={24} 
                  weight="duotone"
                  color="#FFFFFF"
                />
              </div>
            </>
          </motion.div>
          <motion.div 
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
              {isRegistered ? '価格情報の追加' : '新規商品登録'}
            </h2>
            <p className="text-xs sm:text-sm text-orange-600/70">
              {isRegistered ? '商品の価格情報を更新します' : '新しい商品を登録します'}
            </p>
          </motion.div>
        </div>
  
        {/* フォーム部分 */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          {/* 商品情報表示部分 */}
          <motion.div 
            className="bg-orange-50/50 rounded-xl p-3 sm:p-4 border border-orange-100"
            whileHover={{ backgroundColor: 'rgba(255, 237, 213, 0.4)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-4">
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
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center border border-orange-100">
                    <ImageSquare weight="duotone" size={40} color="#FDBA74" />
                  </div>
                )}
              </div>
  
              {/* 商品詳細 */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex flex-wrap gap-1.5">
                  {makerName && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {makerName}
                    </span>
                  )}
                  {brandName && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      {brandName}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">{name}</h3>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                  <Barcode weight="duotone" size={16} color="#FBBA74" />
                  <span>{barcode}</span>
                </div>
              </div>
            </div>
          </motion.div>
  
          {/* 店舗選択 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              店舗を選択
            </label>
            <Listbox value={selectedStoreId} onChange={handleStoreSelect}>
              <div className="relative">
                <Listbox.Button className={twMerge(
                  "relative w-full cursor-default",
                  "rounded-xl bg-white py-2.5 pl-10 pr-10 text-left",
                  "border border-orange-100",
                  "outline-none",
                  "focus:border-transparent",
                  "focus:ring-2 focus:ring-orange-500/20",
                  "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
                  "transition-all duration-200",
                  "shadow-sm"
                )}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Storefront 
                      size={20} 
                      weight="duotone"
                      color="#FB923C"
                    />
                  </div>
                  <span className="block truncate text-base font-medium text-gray-700">
                    {selectedStoreId
                      ? stores.find((store) => store.id === selectedStoreId)?.name
                      : '店舗を選択してください'}
                  </span>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CaretDown 
                      size={20}
                      weight="bold"
                      color="#FB923C"
                    />
                  </div>
                </Listbox.Button>
  
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className={twMerge(
                    "absolute mt-1 max-h-60 w-full overflow-auto",
                    "rounded-xl bg-white py-1",
                    "text-base shadow-lg",
                    "ring-1 ring-orange-100",
                    "focus:outline-none",
                    "z-50"
                  )}>
                    {stores.map((store) => (
                      <Listbox.Option
                        key={store.id}
                        value={store.id}
                        className={({ active }) => twMerge(
                          "relative cursor-default select-none",
                          "py-2.5 pl-10 pr-4",
                          active ? "bg-orange-50 text-orange-900" : "text-gray-900",
                          "transition-colors duration-100"
                        )}
                      >
                        {({ selected }) => (
                          <>
                            <span className={twMerge(
                              "block truncate",
                              selected ? "font-medium" : "font-normal"
                            )}>
                              {store.name}
                            </span>
                            {selected && (
                              <motion.span 
                                className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <Tag weight="duotone" size={20} />
                              </motion.span>
                            )}
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
                <CurrencyJpy weight="duotone" size={20} color="#FBBA74" />
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={twMerge(
                  "w-full rounded-xl",
                  "pl-10 py-2.5",
                  "text-base font-medium text-gray-700",
                  "bg-white",
                  "border border-orange-100",
                  "outline-none",
                  "focus:border-transparent",
                  "focus:ring-2 focus:ring-orange-500/20",
                  "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
                  "placeholder:text-gray-400",
                  "transition-shadow duration-200",
                  "[appearance:textfield]",
                  "[&::-webkit-outer-spin-button]:appearance-none",
                  "[&::-webkit-inner-spin-button]:appearance-none",
                  "shadow-sm"
                )}
                placeholder="0"
                required
              />
            </div>
  
            {/* 既存の価格情報表示 */}
            <AnimatePresence>
              {selectedStoreId && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-orange-50/50 rounded-xl border border-orange-100 mt-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-gray-600">現在の登録価格：</span>
                      <div className="flex items-center">
                        <CurrencyJpy weight="duotone" size={16} color="#F97326" />
                        <span className="text-base font-medium text-gray-900">
                          {productStorePrice ? productStorePrice.price.toLocaleString() : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {productStorePrice && <Calendar weight="duotone" size={16} color="#FBBA74" />}
                      <span className="text-sm text-gray-500">
                        {productStorePrice ? dayjs(productStorePrice.updatedAt).format('YYYY/MM/DD') : ''}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
  
          {/* フッター部分 */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
            {/* 店舗追加ボタン */}
            <motion.button
              type="button"
              onClick={() => setIsStoreModalOpen(true)}
              className={twMerge(
                "inline-flex items-center justify-center gap-2",
                "px-4 py-2.5",
                "bg-white text-gray-700",
                "border border-orange-100 rounded-xl",
                "outline-none",
                "hover:bg-orange-50",
                "focus:border-transparent",
                "focus:ring-2 focus:ring-orange-500/20",
                "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
                "transition-all duration-200"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Storefront weight="duotone" size={20} color="#FBBA74" />
              店舗追加
            </motion.button>
  
            <div className="flex gap-3 w-full sm:w-auto">
              {/* キャンセルボタン */}
              <motion.button
                type="button"
                onClick={handleClose}
                className={twMerge(
                  "flex-1 sm:flex-initial",
                  "inline-flex items-center justify-center",
                  "px-4 py-2.5",
                  "bg-white text-gray-600",
                  "border border-gray-200 rounded-xl",
                  "outline-none",
                  "hover:bg-gray-50",
                  "focus:border-transparent",
                  "focus:ring-2 focus:ring-red-500/20",
                  "focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]",
                  "transition-all duration-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                キャンセル
              </motion.button>
              {/* 登録/更新ボタン */}
              <motion.button
                type="submit"
                className={twMerge(
                  "flex-1 sm:flex-initial",
                  "inline-flex items-center justify-center gap-1.5",
                  "px-4 py-2.5",
                  "bg-orange-500 text-white",
                  "border border-transparent rounded-xl",
                  "outline-none",
                  "hover:bg-orange-600",
                  "focus:border-transparent",
                  "focus:ring-2 focus:ring-orange-500/20",
                  "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
                  "transition-all duration-200"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus weight="bold" size={20} />
                {productStorePrice ? '更新' : '登録'}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
  
      {/* 店舗追加モーダル */}
      <StoreRegistrationModal
        isOpen={isStoreModalOpen}
        onClose={handleStoreModalClose}
      />
    </Modal>
  );
};

export default AddProductModal;