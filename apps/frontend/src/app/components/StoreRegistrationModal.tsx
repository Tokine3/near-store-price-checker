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

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full">
            <BuildingStorefrontIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 
              id="store-registration-title"
              className="text-2xl font-bold text-gray-900"
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
                  "w-full rounded-md border-gray-300",
                  "pl-10 py-3",
                  "focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2",
                  "placeholder:text-gray-400",
                  "transition-colors",
                  "text-[#696969]"
                )}
                placeholder="例：やまだスーパー"
                required
                aria-label="店舗名を入力"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetAndClose}
              className={twMerge(
                "px-4 py-2",
                "text-sm font-medium text-gray-700",
                "bg-white border border-gray-300 rounded-md",
                "hover:bg-gray-50",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                "transition-colors"
              )}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={twMerge(
                "px-4 py-2",
                "text-sm font-medium text-white",
                "bg-indigo-600 rounded-md",
                "hover:bg-indigo-700",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                "transition-colors"
              )}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default StoreRegistrationModal;