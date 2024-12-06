import { useState, type FC } from 'react';
import Modal from 'react-modal';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BuildingStorefrontIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Props = {
  /** モーダルの表示状態 */
  isOpen: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
}

const StoreRegistrationModal: FC<Props> = ({ isOpen, onClose }) => {
  const [storeName, setStoreName] = useState('');

  const resetAndClose = () => {
    setStoreName('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:8000/stores', {
        name: storeName,
      });
      toast.success('店舗を追加しました');
      resetAndClose();
    } catch (error) {
      console.error('Error registering store:', error);
      toast.error('店舗の追加に失敗しました');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={resetAndClose}
      className={twMerge(
        "w-full max-w-md mx-auto mt-20",
        "bg-white rounded-lg shadow-xl",
        "p-6",
        "sm:max-w-lg"
      )}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      ariaHideApp={false}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      role="dialog"
      aria-labelledby="store-registration-title"
    >
      <div className="relative flex flex-col gap-8">
        <button
          type="button"
          onClick={resetAndClose}
          className={twMerge(
            "absolute -top-2 -right-2",
            "p-2 rounded-full",
            "bg-white shadow-md",
            "hover:bg-gray-50",
            "transition-colors"
          )}
          aria-label="閉じる"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500" />
        </button>

        { /* Header */ }
        <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
            <BuildingStorefrontIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 
              id="store-registration-title"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800"
            >
              店舗追加
            </h2>
            <p className="text-sm text-gray-500">
              新しい店舗を追加してください
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="storeName" 
              className="text-sm font-medium text-gray-700"
            >
              店舗名
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingStorefrontIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className={twMerge(
                  "w-full rounded-lg",
                  "pl-10 py-2.5",
                  "text-base font-medium text-gray-700",
                  "bg-white",
                  "border border-gray-200",
                  "outline-none",
                  "focus:border-transparent",
                  "focus:ring-1 focus:ring-blue-500/30",
                  "focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]",
                  "placeholder:text-gray-400",
                  "transition-shadow duration-200",
                  "shadow-sm"
                )}
                placeholder="例：やまだスーパー"
                required
                aria-label="店舗名を入力"
              />
            </div>
          </div>

          {/* 画面右上の閉じるボタン */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetAndClose}
              className={twMerge(
                "absolute -top-2 -right-2",
                "p-2 rounded-full",
                "bg-white text-red-600",
                "border border-red-200",
                "outline-none",
                "hover:bg-red-50",
                "focus:border-transparent",
                "focus:ring-1 focus:ring-red-500/30",
                "focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]",
                "transition-shadow duration-200",
                "shadow-md"
              )}
              aria-label="閉じる"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            {/* フッターのボタン */}
            <div className="flex justify-end gap-3">
              {/* キャンセルボタン */}
              <button
                type="button"
                onClick={resetAndClose}
                className={twMerge(
                  "inline-flex items-center",
                  "px-4 py-2",
                  "bg-white text-gray-600",
                  "border border-gray-200 rounded-lg",
                  "outline-none",
                  "hover:bg-gray-50",
                  "focus:border-transparent",
                  "focus:ring-1 focus:ring-red-500/30",
                  "focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]",
                  "transition-shadow duration-200"
                )}
              >
                キャンセル
              </button>
              {/* 追加ボタン */}
              <button
                type="submit"
                className={twMerge(
                  "inline-flex items-center",
                  "px-4 py-2",
                  "bg-blue-600 text-white",
                  "border border-transparent rounded-lg",
                  "outline-none",
                  "hover:bg-blue-700",
                  "focus:border-transparent",
                  "focus:ring-1 focus:ring-blue-500/30",
                  "focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]",
                  "transition-all duration-200"
                )}
              >
                追加
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StoreRegistrationModal;