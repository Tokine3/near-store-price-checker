'use client';

import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import AddProductModal from '../components/AddProductModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Listbox, Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import Modal from 'react-modal';
import StoreRegistrationModal from '../components/StoreRegistrationModal';
import BarcodeReaderModal from '../components/BarCodeReaderModal';
import { Bars3Icon, BuildingStorefrontIcon, CalendarIcon, MagnifyingGlassIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { ArrowTrendingUpIcon, CheckIcon, ChevronDownIcon, ChevronUpDownIcon, CurrencyYenIcon, PhotoIcon } from '@heroicons/react/20/solid';

type BarcodeResult = {
  text: string;
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

type Product = {
  id: string;
  name: string;
  makerName?: string;
  brandName?: string;
  barcode: string;
  prices: ProductPrice[];
  isRegistered?: boolean;
}

type ScannedProduct = {
  name: string;
  makerName?: string;
  brandName?: string;
  barcode: string;
  prices?: ProductPrice[];
  isRegistered?: boolean;
}

const HomePage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('body');
    }
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<ScannedProduct | null>(null);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isBarcodeReaderOpen, setIsBarcodeReaderOpen] = useState(false);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [selectedSearchStoreId, setSelectedSearchStoreId] = useState<string>('all');
  const [stores, setStores] = useState<Array<{ id: string; name: string }>>([]);

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
    const response = await axios.get('http://localhost:8000/stores');
    setStores([{ id: 'all', name: '全ての店舗' }, ...response.data]);
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
    // 完全にモーダルが閉じてから次のモーダルを開く
    setTimeout(() => {
      setIsBarcodeReaderOpen(true);
    }, 300);
  };

  const handleSubmitProduct = async (data: { storeId: number; price: number }) => {
    if (!scannedProduct) {
      toast.error('商品情報が見つかりません');
      return;
    }
  
    try {
      if (!scannedProduct.isRegistered) {
        await axios.post('http://localhost:8000/products', {
          name: scannedProduct.name,
          makerName: scannedProduct.makerName,
          brandName: scannedProduct.brandName,
          barcode: scannedProduct.barcode,
          price: data.price,
          storeId: data.storeId,
        });
      } else {
        await axios.post(`http://localhost:8000/products/new-prices/${scannedProduct.barcode}`, {
          storeId: data.storeId,
          price: data.price,
        });
        await handleSearch();
      }
  
      toast.success('商品情報を登録しました');
      setIsModalOpen(false);
      setScannedProduct(null);
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error('商品情報の登録に失敗しました');
    }
  };

  // アコーディオンクリックハンドラ
  const handleProductClick = (productId: string) => {
    setExpandedProductId(prevId => prevId === productId ? null : productId);
  };

// 検索処理
  const handleSearch = async () => {
    try {
      const storeQuery = selectedSearchStoreId !== '&storeId=all' ? `&storeId=${selectedSearchStoreId}` : '';
      const response = await axios.get<Product[]>(
        `http://localhost:8000/products/search?term=${encodeURIComponent(searchTerm.trim())}${storeQuery}`
      );

      console.log(response.data);

      if (response.data.length === 0) {
        setSearchResults([]);
      }
      
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('商品の検索に失敗しました');
    }
  };

  const handleBarcodeDetected = async (error: unknown, result?: BarcodeResult | null) => {
    if (!result?.text) return;
    
    setIsBarcodeReaderOpen(false);

    try {
      const response = await axios.get(`http://localhost:8000/products/barcode/${result.text}`);
      const productData = response.data;

      setScannedProduct({
        name: productData.name,
        barcode: result.text,
        brandName: productData.brandName,
        makerName: productData.makerName,
        isRegistered: productData.isRegistered
      });

      setIsModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error('商品が見つかりませんでした');
        requestAnimationFrame(() => setIsBarcodeReaderOpen(true));
      } else {
        toast.error('エラーが発生しました');
      }
    }
  };

    // コンポーネントのマウント時に実行
    useEffect(() => {
      // コンポーネントマウント時に店舗情報を取得
      fetchStores();

      if (typeof window !== 'undefined') {
        Modal.setAppElement('body');
      }
      
      return () => {
        // アンマウント時にすべてのモーダルを確実に閉じる
        setIsModalOpen(false);
        setIsBarcodeReaderOpen(false);
        setScannedProduct(null);
      };
    }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-indigo-600 text-center">
            商品価格チェッカー
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 検索フォーム */}
        <div className="max-w-3xl mx-auto mb-8">
          {/* 検索フォームと店舗選択 */}
          <div className="space-y-4">
            {/* 検索入力フィールド */}
            <div className="relative flex-1 max-w-lg mx-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="商品名を入力"
                className={twMerge(
                  "block w-full",
                  "pl-10 pr-3 py-2",
                  "text-base text-gray-900",
                  "placeholder:text-gray-400",
                  "bg-white",
                  "border border-gray-200 rounded-lg", // ボーダーとボーダーラディウス
                  "focus:ring-0", // フォーカス時のスタイル
                  "shadow-sm", // シャドウ
                )}
              />
            </div>

            {/* 店舗選択 */}
            <div className="relative max-w-lg mx-auto">
              <Listbox value={selectedSearchStoreId} onChange={setSelectedSearchStoreId}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
                    <span className="block truncate text-base font-medium text-gray-700">
                      {stores.find((store) => store.id === selectedSearchStoreId)?.name || '店舗を選択'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {stores.map((store) => (
                        <Listbox.Option
                          key={store.id}
                          value={store.id}
                          className={({ active }) =>
                            twMerge(
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                              active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                {store.name}
                              </span>
                              {selected && (
                                <span
                                  className={twMerge(
                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                    active ? 'text-white' : 'text-indigo-600'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
          
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={handleSearch}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                検索
              </button>
              <button
                onClick={() => setIsBarcodeReaderOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <QrCodeIcon className="h-5 w-5 mr-2" />
                バーコード読取
              </button>
            </div>
          </div>
        </div>

        {/* セパレーター */}
        <div className="space-y-4  space-x-3 mx-auto mb-8"> {}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200" />
            </div>
          </div>
        </div>

        {/* 商品一覧*/}
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <BuildingStorefrontIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                最安値の商品がありません
              </h3>
              <p className="text-sm text-gray-500">
                選択した店舗での商品情報が登録されていません
              </p>
            </div>
          ) : (
            searchResults.map((product: Product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    {/* 商品画像と情報 */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                      {/* 商品画像 */}
                      <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0">
                        {product.barcode ? (
                          <Image
                            src={`https://image.jancodelookup.com/${product.barcode}`}
                            alt={product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* 商品情報 */}
                      <div className="flex-1 min-w-0">
                        {/* メーカー・ブランド情報 */}
                        <div className="flex flex-wrap gap-2 mb-1">
                          {product.makerName && (
                          // メーカー名のバッジ
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {product.makerName}
                          </span>
                          )}
                          {product.brandName && (
                            // ブランド名のバッジ
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {product.brandName}
                            </span>
                          )}
                        </div>

                        {/* 商品名 */}
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          {product.name}
                          <ChevronDownIcon 
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                              expandedProductId === product.id ? 'transform rotate-180' : ''
                            }`}
                          />
                        </h2>

                        {/* 店舗情報と登録日 */}
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center text-gray-500">
                            <BuildingStorefrontIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm">{product.prices[0]?.store.name ?? '-'}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {product.prices[0]?.updatedAt ? dayjs(product.prices[0].updatedAt).format('YYYY/MM/DD') : '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 最安値の価格表示 */}
                    <div className={twMerge(
                      "w-full sm:w-auto text-right mt-2 sm:mt-0",
                      "transition-opacity duration-200",
                      (isModalOpen || isStoreModalOpen || isBarcodeReaderOpen) && "opacity-50"
                    )}>
                      <div className="relative pt-8">
                        {/* 更新バッジ */}
                        <div className="absolute -top-1 right-0 z-10">
                          <div className={twMerge(
                            "flex items-center gap-1 px-2 py-1 rounded-full border shadow-sm w-[120px] justify-center transition-opacity duration-200",
                            product.prices[0]?.updatedAt && isUpdatedWithinDays(product.prices[0].updatedAt, 7)
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-600 border-gray-200",
                          )}>
                            <svg
                              className="w-3 h-3 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-xs font-medium whitespace-nowrap">
                              {product.prices[0]?.updatedAt && isUpdatedWithinDays(product.prices[0].updatedAt, 7)
                                ? "7日以内に更新"
                                : "7日以上更新なし"}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 mb-1">最安価格</div>
                        <div className="flex items-center justify-end gap-1">
                          <CurrencyYenIcon className="h-6 w-6 text-indigo-600" />
                          <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                            {product.prices[0]?.price.toLocaleString() ?? '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* アコーディオンの内容 */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    expandedProductId === product.id ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">他店舗の価格</h3>
                    <div className="space-y-2">
                      {product.prices?.length <= 1 ? (
                        <div className="text-sm text-gray-500 text-center py-2 bg-gray-50 rounded-lg">
                          登録されていません
                        </div>
                      ) : (
                        product.prices
                          ?.slice(1)
                          ?.map((priceInfo) => (
                            <div
                              key={`${priceInfo.store.name}-${priceInfo.price}`}
                              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center gap-2">
                                <BuildingStorefrontIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{priceInfo.store.name}</span>
                              </div>
                              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md">
                                <ArrowTrendingUpIcon className="h-4 w-3 text-red-600" />
                                  <span className="text-xs font-medium text-red-600">
                                    最安値 +¥{(priceInfo.price - product.prices[0].price).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CurrencyYenIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-900 font-medium">
                                    {priceInfo.price.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {dayjs(priceInfo.updatedAt).format('YYYY/MM/DD')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )))}
            </div>
      </div>

      {/* Navigation Menu */}
      <Menu as="div" className="fixed bottom-6 left-6">
        <Menu.Button className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Bars3Icon className="h-6 w-6" />
        </Menu.Button>
        <Menu.Items className="absolute left-0 bottom-16 w-48 bg-white rounded-lg shadow-lg divide-y divide-gray-100 overflow-hidden focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/"
                className={`flex items-center px-4 py-3 text-sm ${
                  active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
              >
                <HomeIcon className="h-5 w-5 mr-3" />
                一覧
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => setIsStoreModalOpen(true)}
                className={`flex items-center w-full px-4 py-3 text-sm ${
                  active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                }`}
              >
                <BuildingStorefrontIcon className="h-5 w-5 mr-3" />
                店舗追加
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* Modals */}
      <AddProductModal
        isOpen={isModalOpen && scannedProduct !== null}
        onClose={handleCancel}
        makerName={scannedProduct?.makerName || ''}
        brandName={scannedProduct?.brandName || ''}
        name={scannedProduct?.name || ''}
        barcode={scannedProduct?.barcode || ''}
        onSubmit={handleSubmitProduct}
        isRegistered={scannedProduct?.isRegistered}
        scannedProduct={searchResults.find(p => p.barcode === scannedProduct?.barcode)?.prices || []}
        // selectedStorePrice={scannedProduct?.prices}
        // selectedStorePrice={scannedProduct?.prices?.find(
        //   price => price.store.id === parseInt(selectedStoreId)
        // )}
      />

      <BarcodeReaderModal
        key={isBarcodeReaderOpen ? 'open' : 'closed'}
        isOpen={isBarcodeReaderOpen}
        onClose={() => setIsBarcodeReaderOpen(false)}
        onDetected={handleBarcodeDetected}
      />

      <StoreRegistrationModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
      />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};


export default HomePage;