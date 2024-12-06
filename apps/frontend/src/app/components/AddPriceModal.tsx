'use client';

import React, { useState } from 'react';
import Modal from 'react-modal';
import { twMerge } from 'tailwind-merge';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  barcode: string;
  onSubmit: (data: { store: string; price: number }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  productName,
  barcode,
  onSubmit,
}) => {
  const [store, setStore] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      store,
      price: parseInt(price),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={twMerge(
        "max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-xl",
        "sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      )}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">商品情報の登録</h2>
      <p className="mb-4 text-center">商品名: {productName}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">店舗</label>
          <select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">選択してください</option>
            <option value="バロー">バロー</option>
            <option value="ゲンキー">ゲンキー</option>
            <option value="スギ薬局">スギ薬局</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">価格</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            登録
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;