import { useState, type FC } from 'react';
import Modal from 'react-modal';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  X,
  Plus,
  Storefront
} from '@phosphor-icons/react';

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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={resetAndClose}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      ariaHideApp={false}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-4 sm:p-6">
        {/* 閉じるボタン */}
        <motion.button
          type="button"
          onClick={resetAndClose}
          className={twMerge(
            "absolute -top-2 -right-2 z-10",
            "p-2 rounded-full",
            "bg-white text-gray-500",
            "border border-orange-100",
            "outline-none",
            "hover:bg-orange-50",
            "focus:border-transparent",
            "focus:ring-2 focus:ring-orange-500/20",
            "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
            "transition-all duration-200",
            "shadow-md"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="閉じる"
        >
          <X weight="bold" size={20} />
        </motion.button>

        {/* ヘッダー部分 */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-orange-100">
          <motion.div 
            className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Storefront size={28} weight="duotone" color="#FFFFFF" />
          </motion.div>
          <motion.div 
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
              店舗追加
            </h2>
            <p className="text-xs sm:text-sm text-orange-600/70">
              新しい店舗を追加してください
            </p>
          </motion.div>
        </div>

        {/* フォーム部分 */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="flex flex-col gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col gap-2 mt-4">
            <label 
              htmlFor="storeName" 
              className="text-sm font-medium text-gray-700"
            >
              店舗名
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Storefront 
                  size={20}  // h-5 w-5 (5 * 4 = 20px)
                  weight="duotone"
                  color="#FB923C"  // text-orange-400
                />
              </div>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
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
                  "shadow-sm"
                )}
                placeholder="例：やまだスーパー"
                required
              />
            </div>
          </div>

          {/* フッターボタン */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            {/* キャンセルボタン */}
            <motion.button
              type="button"
              onClick={resetAndClose}
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
            {/* 追加ボタン */}
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
              <Plus 
                size={20}  // h-5 w-5 (5 * 4 = 20px)
                weight="bold"
                color="#FFFFFF"  // ボタン内のアイコンなのでtext-white
              />
              追加
            </motion.button>
          </div>
        </motion.form>
      </div>
    </Modal>
  );
};

export default StoreRegistrationModal;