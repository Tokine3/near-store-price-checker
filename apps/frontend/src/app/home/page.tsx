'use client';

import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Listbox, Transition } from '@headlessui/react';
import Modal from 'react-modal';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import {
  ArrowTrendingUpIcon,
  BuildingStorefrontIcon,
  TagIcon,
} from '@heroicons/react/20/solid';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CurrencyJpy,
  ShoppingCart,
  Tag,
  CaretDoubleDown,
  MagnifyingGlass,
  Storefront,
  CaretUpDown,
  Barcode,
  List,
  CaretDown,
  Calendar,
  Timer,
  CaretUp,
  Info,
  Plus,
} from '@phosphor-icons/react';
import { AddProductModal } from '../components/AddProductModal';
import { BarCodeReaderModal } from '../components/BarCodeReaderModal';
import { ProductSearchModal } from '../components/ProductSearchModal';
import { StoreRegistrationModal } from '../components/StoreRegistrationModal';
import { api } from '@/lib/axios';
import { LoadingOverlay } from '../components/common/LoadingOverlay/LoadingOverlay';
import { NoImage } from '../components/common/NoImage/NoImage';

type BarcodeResult = {
  barcodeNo: string;
};

export type ProductPrice = {
  id: number;
  price: number;
  store: {
    id: number;
    name: string;
  };
  updatedAt: string;
};

type Product = {
  id: string;
  name: string;
  makerName?: string;
  brandName?: string;
  barcode: string;
  imageUrl: string;
  prices: ProductPrice[];
  isRegistered: boolean;
};

export type ScannedProduct = {
  name: string;
  makerName?: string;
  brandName?: string;
  barcode: string;
  imageUrl: string;
  prices?: ProductPrice[];
  isRegistered: boolean;
};

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(
    null
  );
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isBarcodeReaderOpen, setIsBarcodeReaderOpen] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(
    null
  );
  const [selectedSearchStoreId, setSelectedSearchStoreId] =
    useState<string>('all');
  const [stores, setStores] = useState<Array<{ id: string; name: string }>>([]);
  const [scrollY, setScrollY] = useState(0); // スクロール位置の状態管理
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // バーコードから商品を検索中の状態管理
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const updateLastLoginTime = async () => {
      try {
        await api.patch('/users/login');
      } catch (error) {
        console.error('Failed to update last login time:', error);
      }
    };

    // コンポーネントマウント時に最終ログイン時間を更新
    updateLastLoginTime();

    // 既存のuseEffect処理
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    fetchStores();

    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      setIsModalOpen(false);
      setIsBarcodeReaderOpen(false);
      setScannedProduct(null);
    };
  }, []);

  // 画像読み込みエラー時の処理
  const handleImageError = (productId: string) => {
    setImageLoadError((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  // エンターキーイベントをキャンセルする関数
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 漢字変換や入力した日本語の確定を行うEnterキー入力は無視
    if (e.key === 'Enter' && e.nativeEvent.isComposing) {
      e.preventDefault();
      return;
    }

    // 入力確定後のEnterキーで検索実行
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSearch();
    }
  };

  // 店舗情報を取得する関数
  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      setStores([{ id: 'all', name: 'すべての店舗' }, ...response.data]);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('店舗情報の取得に失敗しました');
    }
  };

  // 指定された日にち以内に更新されているか確認する関数
  const isUpdatedWithinDays = (date: string, days: number) => {
    const updatedDate = dayjs(date);
    const daysAgo = dayjs().subtract(days, 'day');
    return updatedDate.isAfter(daysAgo);
  };

  // キャンセルボタンの処理
  const handleCancel = () => {
    setIsModalOpen(false);
    setScannedProduct(null);
    setIsBarcodeReaderOpen(false);
  };

  const handleSubmitProduct = async (data: {
    storeId: number;
    price: number;
    name: string;
  }) => {
    if (!scannedProduct) {
      toast.error('商品情報が見つかりません');
      return;
    }

    try {
      if (!scannedProduct.isRegistered) {
        await api.post('/products', {
          name: data.name,
          makerName: scannedProduct.makerName,
          brandName: scannedProduct.brandName,
          barcode: scannedProduct.barcode,
          price: data.price,
          storeId: data.storeId,
        });
      } else {
        await api.post(`/products/new-prices/${scannedProduct.barcode}`, {
          name: data.name,
          storeId: data.storeId,
          price: data.price,
        });
      }

      toast.success('商品情報を登録しました');
      setIsModalOpen(false);
      setIsBarcodeReaderOpen(false);
      setScannedProduct(null);
      // 現在の検索条件で商品一覧を更新
      const storeQuery =
        selectedSearchStoreId !== '&storeId=all'
          ? `&storeId=${selectedSearchStoreId}`
          : '';
      const response = await api.get<Product[]>(
        `/products/search?term=${encodeURIComponent(
          searchTerm.trim()
        )}${storeQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error('商品情報の登録に敗しました');
    }
  };

  // アコーディオンクリックハンドラ
  const handleProductClick = (productId: string) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  // 検索処理
  const handleSearch = async () => {
    try {
      const storeQuery =
        selectedSearchStoreId !== '&storeId=all'
          ? `&storeId=${selectedSearchStoreId}`
          : '';
      const response = await api.get<Product[]>(
        `/products/search?term=${encodeURIComponent(
          searchTerm.trim()
        )}${storeQuery}`
      );

      if (response.data.length === 0) {
        setSearchResults([]);
      }

      setSearchResults(response.data);
    } catch {
      toast.error('商品の検索に失敗しました');
    }
  };

  const handleBarcodeDetected = async (
    error: unknown,
    result?: BarcodeResult | null
  ) => {
    if (!result?.barcodeNo) return;

    setIsBarcodeReaderOpen(false);
    setIsSearching(true); // ローディング開始

    try {
      if (result.barcodeNo.length < 6) {
        toast.error('バーコード番号が正しくありません');
        requestAnimationFrame(() => setIsBarcodeReaderOpen(true));
        return;
      }
      const response = await api.get(`/products/barcode/${result.barcodeNo}`);
      const productData = response.data;

      const newScannedProduct: ScannedProduct = {
        name: productData.name,
        barcode: productData.barcode,
        brandName: productData.brandName,
        makerName: productData.makerName,
        prices: productData.prices,
        imageUrl: productData.imageUrl,
        isRegistered: productData.isRegistered,
      };

      setScannedProduct(newScannedProduct);
      setIsModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error('商品が見つかりませんでした');
        requestAnimationFrame(() => setIsBarcodeReaderOpen(true));
      } else {
        toast.error('エラーが発生しました');
      }
    } finally {
      setIsSearching(false); // ローディング終了
    }
  };

  // コンポーネントのマウント時に実行
  useEffect(() => {
    // スクロール位置の監視
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // コンポーネントマウント時に店舗情報を取得
    fetchStores();

    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // アンマウント時べてのモーダルを確実に閉じる
      setIsModalOpen(false);
      setIsBarcodeReaderOpen(false);
      setScannedProduct(null);
    };
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50'>
      {/* 固定ナビゲーションバー */}
      <nav className='fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-orange-100 z-50'>
        <div className='flex justify-around py-2'>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className='flex flex-col items-center text-orange-500'
          >
            <MagnifyingGlass size={24} weight='duotone' />
            <span className='text-xs'>検索</span>
          </button>
          <button
            onClick={() => setIsBarcodeReaderOpen(true)}
            className='flex flex-col items-center text-orange-500'
          >
            <Barcode size={24} weight='duotone' />
            <span className='text-xs'>バーコード</span>
          </button>
          <button
            onClick={() => setIsStoreModalOpen(true)}
            className='flex flex-col items-center text-orange-500'
          >
            <Storefront size={24} weight='duotone' />
            <span className='text-xs'>店舗追加</span>
          </button>
        </div>
      </nav>

      <div className='container mx-auto px-4 pt-4 pb-8'>
        {/* ヘッダー部分のコンテナ */}
        <div className='relative pb-6'>
          <div className='flex flex-col items-center gap-3'>
            <div className='flex items-center justify-center h-12 px-4 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg shadow-md'>
              <div className='flex items-center gap-2'>
                <motion.div
                  animate={{ rotate: [0, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className='text-white'>
                    <ShoppingCart size={24} weight='duotone' />
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className='text-white/80'>
                    <Tag size={20} weight='duotone' />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* タイトルとサブタイトル */}
            <div className='flex flex-col items-center'>
              <motion.h1
                className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                お値段ナビ！
              </motion.h1>
              <motion.p
                className='text-xs text-orange-600/70 mt-0.5'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                いろんな商品の最安値や店舗ごとの価格を見ることができます
              </motion.p>
            </div>
          </div>

          {/* ボーダーを別要素として配置 */}
          <div className='absolute bottom-0 left-0 right-0 h-px bg-orange-200' />
        </div>

        {/* スクロールインジケーター */}
        <motion.div
          className='hidden md:block fixed bottom-4 left-1/2 transform -translate-x-1/2'
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CaretDoubleDown size={24} weight='duotone' color='#FB923C' />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-4'>
          {/* 検索フォーム */}
          <div className='container mx-auto pt-1 pb-4'>
            <motion.div className='space-y-4'>
              {/* 検索入力フィールド */}
              <div className='relative flex-1 max-w-lg mx-auto'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <MagnifyingGlass weight='duotone' size={20} color='#FB923C' />
                </div>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='商品名を入力'
                  className={twMerge(
                    'block w-full',
                    'pl-10 pr-3 py-3',
                    'text-base font-medium text-gray-700',
                    'bg-white',
                    'border border-orange-100 rounded-xl',
                    'outline-none',
                    'focus:border-transparent',
                    'focus:ring-2 focus:ring-orange-500/20',
                    'placeholder:text-gray-400',
                    'transition-all duration-200',
                    'shadow-sm'
                  )}
                />
              </div>

              {/* 店舗選択 */}
              <div className='relative max-w-lg mx-auto'>
                <Listbox
                  value={selectedSearchStoreId}
                  onChange={setSelectedSearchStoreId}
                >
                  <div className='relative'>
                    <Listbox.Button
                      className={twMerge(
                        'relative w-full cursor-default',
                        'rounded-xl bg-white py-3 pl-10 pr-10',
                        'border border-orange-100',
                        'outline-none',
                        'focus:border-transparent',
                        'focus:ring-2 focus:ring-orange-500/20',
                        'transition-all duration-200',
                        'shadow-sm'
                      )}
                    >
                      <span className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        <Storefront
                          weight='duotone'
                          size={20}
                          color='#FB923C'
                        />
                      </span>
                      <span className='block truncate text-base font-medium text-gray-700'>
                        {stores.find(
                          (store) => store.id === selectedSearchStoreId
                        )?.name || '店舗を選択'}
                      </span>
                      <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                        <CaretUpDown weight='bold' size={20} color='#FB923C' />
                      </span>
                    </Listbox.Button>

                    <Transition
                      as={Fragment}
                      leave='transition ease-in duration-100'
                      leaveFrom='opacity-100'
                      leaveTo='opacity-0'
                    >
                      <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        {stores.map((store) => (
                          <Listbox.Option
                            key={store.id}
                            value={store.id}
                            className={({ active }) =>
                              twMerge(
                                'relative cursor-default select-none py-2 pl-10 pr-4',
                                active
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'text-gray-700'
                              )
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={twMerge(
                                    'block truncate',
                                    selected ? 'font-medium' : 'font-normal'
                                  )}
                                >
                                  {store.name}
                                </span>
                                {selected && (
                                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500'>
                                    <Tag weight='bold' size={20} />
                                  </span>
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

              {/* ボタングループ */}
              <motion.div
                className='mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  onClick={handleSearch}
                  className={twMerge(
                    'inline-flex items-center justify-center gap-2',
                    'w-full sm:w-auto',
                    'px-4 py-2.5',
                    'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
                    'border border-transparent rounded-xl',
                    'outline-none',
                    'hover:from-orange-600 hover:to-amber-600',
                    'focus:ring-2 focus:ring-orange-500/20',
                    'transition-all duration-200'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MagnifyingGlass size={20} weight='bold' color='#FFFFFF' />
                  検索
                </motion.button>

                <motion.button
                  onClick={() => setIsBarcodeReaderOpen(true)}
                  className={twMerge(
                    'inline-flex items-center justify-center gap-2',
                    'w-full sm:w-auto',
                    'px-4 py-2.5',
                    'bg-white text-gray-700',
                    'border border-orange-100 rounded-xl',
                    'outline-none',
                    'hover:bg-orange-50',
                    'focus:ring-2 focus:ring-orange-500/20',
                    'transition-all duration-200'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Barcode weight='duotone' size={20} color='#FB923C' />
                  バーコード読取
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* セパレーター */}
          <div className='relative'>
            <div
              className='absolute inset-0 flex items-center'
              aria-hidden='true'
            >
              <div className='w-full border-t border-orange-200' />
            </div>
          </div>

          {/* 商品一覧*/}
          <div className='flex flex-col gap-6 pb-24'>
            {/* 検索結果件数表示 - 検索結果がある場合のみ表示 */}
            {searchResults.length > 0 && (
              <motion.div
                className='flex items-center gap-2 text-sm text-orange-600/70'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full'>
                  <List size={14} weight='bold' color='#F97316' />
                </div>
                <span>
                  検索結果:{' '}
                  <strong className='font-medium'>
                    {searchResults.length}
                  </strong>{' '}
                  件
                </span>
              </motion.div>
            )}

            {searchResults.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden'
              >
                <div className='text-center py-12'>
                  <motion.div
                    className='inline-flex items-center justify-center w-20 h-20 rounded-xl bg-orange-50 mb-4'
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                  >
                    <Storefront size={40} weight='duotone' color='#FCD34D' />
                  </motion.div>
                  <motion.h3
                    className='text-xl font-medium text-gray-900 mb-2'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    最安値の商品がありません
                  </motion.h3>
                  <motion.p
                    className='text-sm text-gray-500'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    選択した店舗での商品情報が登録されていません
                  </motion.p>
                </div>
              </motion.div>
            ) : (
              searchResults.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className='bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden'
                >
                  <motion.button
                    onClick={() => handleProductClick(product.id)}
                    className='w-full text-left'
                    whileHover={{ backgroundColor: 'rgba(251, 146, 60, 0.05)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className='p-4 sm:p-6'>
                      <div className='flex items-center flex-col sm:flex-row gap-4'>
                        {/* 商品画像 */}
                        <div className='w-20 h-20 sm:w-32 sm:h-32 mx-auto sm:mx-0 flex-shrink-0 bg-white rounded-xl overflow-hidden'>
                          {!imageLoadError[product.id] ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={128}
                              height={128}
                              className='w-full h-full object-contain'
                              onError={() => handleImageError(product.id)}
                            />
                          ) : (
                            <NoImage size={32} />
                          )}
                        </div>

                        {/* 商品情報 */}
                        <div className='flex-1 min-w-0 text-center sm:text-left'>
                          {/* メーカー・ブランド情報 */}
                          <div className='flex flex-wrap justify-center sm:justify-start gap-2 mb-2'>
                            {product.makerName && (
                              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
                                {product.makerName}
                              </span>
                            )}
                            {product.brandName && (
                              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
                                {product.brandName}
                              </span>
                            )}
                          </div>

                          {/* 商品名部分 */}
                          <h2 className='text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2 justify-center sm:justify-start'>
                            {product.name}
                            <div
                              className={`transition-transform duration-200 ${
                                expandedProductId === product.id
                                  ? 'rotate-180'
                                  : ''
                              }`}
                            >
                              <CaretDown
                                size={20}
                                weight='bold'
                                color='#FB923C'
                              />
                            </div>
                          </h2>

                          {/* 店舗・日付情報報 */}
                          <div className='flex flex-wrap gap-3 justify-center sm:justify-start'>
                            <div className='flex items-center text-gray-600 gap-1'>
                              <Storefront
                                weight='duotone'
                                size={18}
                                color='#FB923C'
                              />
                              <span className='text-sm'>
                                {product.prices[0]?.store.name ?? '-'}
                              </span>
                            </div>
                            <div className='flex items-center text-gray-600 gap-1'>
                              <Calendar
                                weight='duotone'
                                size={18}
                                color='#FB923C'
                              />
                              <span className='text-sm'>
                                {product.prices[0]?.updatedAt
                                  ? dayjs(product.prices[0].updatedAt).format(
                                      'YYYY/MM/DD'
                                    )
                                  : '-'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 価格表示 */}
                        <div className='w-full sm:w-auto text-center sm:text-right mt-4 sm:mt-0'>
                          <div className='relative pt-8'>
                            {/* 更新バッジ */}
                            <motion.div
                              className={twMerge(
                                'absolute -top-1 left-1/2 sm:left-auto sm:right-0 transform -translate-x-1/2 sm:translate-x-0',
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                                'border shadow-sm',
                                product.prices[0]?.updatedAt &&
                                  isUpdatedWithinDays(
                                    product.prices[0].updatedAt,
                                    7
                                  )
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-gray-50 text-gray-600 border-gray-200'
                              )}
                              whileHover={{ scale: 1.05 }}
                            >
                              <Timer weight='duotone' size={14} />
                              <span className='text-xs font-medium whitespace-nowrap'>
                                {product.prices[0]?.updatedAt &&
                                isUpdatedWithinDays(
                                  product.prices[0].updatedAt,
                                  7
                                )
                                  ? '7日以内に更新'
                                  : '7日以上更新なし'}
                              </span>
                            </motion.div>

                            {/* 価格・店舗情報 */}
                            <div className='flex flex-row sm:flex-col gap-3 justify-center'>
                              {/* 最安値 */}
                              <div className='flex-1 flex flex-col items-center sm:items-end gap-1.5'>
                                <div className='flex items-center gap-1.5 text-sm font-medium text-gray-600'>
                                  <Tag
                                    weight='duotone'
                                    size={16}
                                    className='text-orange-500'
                                  />
                                  <span>最安値</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                  <CurrencyJpy
                                    weight='duotone'
                                    size={28}
                                    color='#F97316'
                                  />
                                  <span className='text-3xl sm:text-3xl font-bold text-orange-500'>
                                    {product.prices[0]?.price.toLocaleString() ??
                                      '-'}
                                  </span>
                                </div>
                              </div>

                              {/* 店舗情報 */}
                              <div className='flex-1 flex flex-col items-center sm:items-end gap-1.5'>
                                <div className='flex items-center gap-1.5 text-sm font-medium text-gray-600'>
                                  <Storefront
                                    weight='duotone'
                                    size={16}
                                    className='text-orange-500'
                                  />
                                  <span>店舗</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                  <span className='text-2xl sm:text-2xl font-bold text-orange-500 truncate max-w-[160px]'>
                                    {product.prices[0]?.store.name ?? '-'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 登録日情報 */}
                            <div className='flex-1 flex flex-col items-center sm:items-end gap-1.5 mt-2'>
                              <div className='flex items-center gap-1.5 text-sm font-medium text-gray-600'>
                                <Calendar
                                  weight='duotone'
                                  size={16}
                                  className='text-orange-500'
                                />
                                <span>登録日</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <span className='text-1xl sm:text-1xl text-gray-500 truncate max-w-[160px]'>
                                  {product.prices[0]?.updatedAt
                                    ? dayjs(product.prices[0].updatedAt).format(
                                        'YYYY/MM/DD'
                                      )
                                    : '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  {/* アコーディオンの内容 */}
                  <AnimatePresence>
                    {expandedProductId === product.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className='p-4 sm:p-6 border-t border-orange-100 bg-orange-50/50'>
                          <div className='space-y-4'>
                            {/* 価格情報のヘッダー */}
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-2 text-gray-900'>
                                <Info
                                  weight='duotone'
                                  size={20}
                                  color='#F97316'
                                />
                                <h3 className='font-medium'>
                                  他の店舗の価格情報
                                </h3>
                              </div>
                              <motion.button
                                onClick={() => {
                                  setScannedProduct({
                                    name: product.name,
                                    makerName: product.makerName,
                                    brandName: product.brandName,
                                    barcode: product.barcode,
                                    imageUrl: product.imageUrl,
                                    isRegistered: true,
                                    prices: product.prices,
                                  });
                                  setIsModalOpen(true);
                                }}
                                className={twMerge(
                                  'p-2 rounded-lg',
                                  'text-orange-500 bg-white',
                                  'border border-orange-100',
                                  'hover:bg-orange-50',
                                  'focus:outline-none focus:ring-2 focus:ring-orange-500/20',
                                  'transition-all duration-200'
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label='価格を追加'
                              >
                                <Plus weight='bold' size={20} />
                              </motion.button>
                            </div>

                            {/* 価格情報リスト */}
                            <div className='space-y-3'>
                              {product.prices.length === 1 ? (
                                <motion.div
                                  className='flex flex-col items-center justify-center gap-2 p-6 bg-white rounded-xl border border-orange-100'
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <Storefront
                                    weight='duotone'
                                    size={28}
                                    color='#FDBA74'
                                  />
                                  <p className='text-sm font-medium text-gray-600'>
                                    他店舗の価格情報が登録されていません
                                  </p>
                                </motion.div>
                              ) : (
                                product.prices.map((price) => {
                                  const lowestPrice = product.prices[0]?.price;
                                  const lowestPriceStoreId =
                                    product.prices[0]?.store.id;
                                  const priceDiff = lowestPrice
                                    ? price.price - lowestPrice
                                    : 0;

                                  if (price.store.id === lowestPriceStoreId)
                                    return null;
                                  return (
                                    <motion.div
                                      key={price.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className='flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl border border-orange-100/50 gap-3 sm:gap-4'
                                    >
                                      {/* 店舗情報 */}
                                      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3'>
                                        <div className='flex items-center gap-1.5 text-gray-700'>
                                          <Storefront
                                            weight='duotone'
                                            size={20}
                                            color='#FB923C'
                                          />
                                          <span className='font-medium'>
                                            {price.store.name}
                                          </span>
                                        </div>
                                        <div className='flex items-center gap-1.5 text-gray-500 text-sm'>
                                          <Calendar
                                            weight='duotone'
                                            size={20}
                                            color='#FB923C'
                                          />
                                          <span>
                                            {dayjs(price.updatedAt).format(
                                              'YYYY/MM/DD'
                                            )}
                                          </span>
                                        </div>
                                      </div>

                                      {/* 価格情報 */}
                                      <div className='flex items-center gap-3 justify-end sm:justify-start ml-auto'>
                                        {/* 価格差バッジ */}
                                        {priceDiff > 0 && (
                                          <div
                                            className={twMerge(
                                              'flex items-center gap-1',
                                              'px-2 py-1 rounded-full',
                                              'text-xs font-medium whitespace-nowrap',
                                              'bg-red-50 text-red-700 border border-red-200'
                                            )}
                                          >
                                            <ArrowTrendingUpIcon className='h-3 w-3' />
                                            <span>
                                              最安値+¥
                                              {priceDiff.toLocaleString()}
                                            </span>
                                          </div>
                                        )}
                                        {/* 価格表示 */}
                                        <div className='flex items-center gap-1.5'>
                                          <CurrencyJpy
                                            weight='duotone'
                                            size={24}
                                            color='#F97316'
                                          />
                                          <span className='text-2xl sm:text-3xl font-bold text-orange-500 whitespace-nowrap'>
                                            {price.price.toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                })
                              )}
                              {/* 商品情報の詳細 */}
                              <div className='mt-4 pt-4 border-t border-orange-100'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                                  {product.makerName && (
                                    <div className='flex items-center gap-2 text-gray-600 text-sm sm:text-base'>
                                      <BuildingStorefrontIcon className='h-5 w-5 text-orange-400 flex-shrink-0' />
                                      <span className='truncate'>
                                        メーカー: {product.makerName}
                                      </span>
                                    </div>
                                  )}
                                  {product.brandName && (
                                    <div className='flex items-center gap-2 text-gray-600 text-sm sm:text-base'>
                                      <TagIcon className='h-5 w-5 text-orange-400 flex-shrink-0' />
                                      <span className='truncate'>
                                        ブランド: {product.brandName}
                                      </span>
                                    </div>
                                  )}
                                  {product.barcode && (
                                    <div className='flex items-center gap-2 text-gray-600 text-sm sm:text-base flex-shrink-0'>
                                      <Barcode
                                        weight='duotone'
                                        size={20}
                                        color='#FB923C'
                                      />
                                      <span className='truncate'>
                                        バーコード: {product.barcode}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <>
        {/* トップへ戻るボタン - 右下に固定 */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={twMerge(
            'fixed bottom-16 right-6', // bottomを6から16に変更
            'p-4 bg-white text-orange-500',
            'rounded-xl shadow-lg',
            'border border-orange-100',
            'hover:bg-orange-50',
            'focus:outline-none focus:ring-2 focus:ring-orange-500/20',
            'transition-all duration-200',
            // 200px以上スクロールした時のみ表示
            scrollY > 200 ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: scrollY > 200 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <CaretUp weight='bold' size={24} />
        </motion.button>
      </>

      {/* Modals */}
      {/* 商品検索モーダル */}
      <ProductSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleKeyDown={handleKeyDown}
        handleSearch={handleSearch}
        selectedSearchStoreId={selectedSearchStoreId}
        setSelectedSearchStoreId={setSelectedSearchStoreId}
        stores={stores}
      />

      {/* 商品追加モーダル */}
      <AddProductModal
        isOpen={isModalOpen && scannedProduct !== null}
        onClose={() => {
          handleCancel();
          fetchStores();
        }}
        makerName={scannedProduct?.makerName || ''}
        brandName={scannedProduct?.brandName || ''}
        name={scannedProduct?.name || ''}
        barcode={scannedProduct?.barcode || ''}
        imageUrl={scannedProduct?.imageUrl || ''}
        onSubmit={handleSubmitProduct}
        isRegistered={scannedProduct?.isRegistered ?? false}
        scannedProduct={scannedProduct}
      />

      {/* バーコード読み取りモーダル */}
      <BarCodeReaderModal
        key={isBarcodeReaderOpen ? 'open' : 'closed'}
        isOpen={isBarcodeReaderOpen}
        onClose={() => setIsBarcodeReaderOpen(false)}
        onDetected={handleBarcodeDetected}
      />

      {/* 店舗追加モーダル */}
      <StoreRegistrationModal
        isOpen={isStoreModalOpen}
        onClose={() => {
          setIsStoreModalOpen(false);
          fetchStores();
        }}
      />

      {/* Loading Overlay */}
      <AnimatePresence>{isSearching && <LoadingOverlay />}</AnimatePresence>

      {/* Toast Container */}
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
};

export default HomePage;
