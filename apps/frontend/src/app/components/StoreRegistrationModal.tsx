'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BuildingStorefrontIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface StoreRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreRegistrationModal: React.FC<StoreRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [storeName, setStoreName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/stores', {
        name: storeName,
      });
      toast.success('店舗を追加しました');
      onClose();
      setStoreName('');
    } catch (error) {
      console.error('Error registering store:', error);
      toast.error('店舗の追加に失敗しました');
    }
  };

  const handleClose = () => {
    setStoreName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className={twMerge(
        "max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl",
        "sm:max-w-lg"
      )}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      closeTimeoutMS={0}
    >
      <div className="relative">
        {/* 閉じるボタン */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>

        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <BuildingStorefrontIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">店舗追加</h2>
          <p className="mt-1 text-sm text-gray-500">
            新しい店舗を追加してください
          </p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="storeName" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              店舗名
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={twMerge(
                  "block w-full rounded-md border-gray-300",
                  "pl-10 py-3 text-base",
                  "focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2",
                  "placeholder:text-gray-400",
                  "transition-colors duration-200",
                  "text-[#696969]"
                )}
                placeholder="例：やまだスーパー"
                required
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 justify-end mt-8"> 
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StoreRegistrationModal;