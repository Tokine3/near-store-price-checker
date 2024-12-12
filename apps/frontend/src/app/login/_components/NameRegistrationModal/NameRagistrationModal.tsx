import { FC, useState } from 'react';
import Modal from 'react-modal';
import { CircleNotch } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { loginAnimations } from '../../_styles';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  onError: (error: Error) => void;
};

export const NameRegistrationModal: FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  onError,
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
    } catch (error) {
      if (error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={!isSubmitting ? onClose : undefined}
      className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 outline-none'
      overlayClassName='fixed inset-0 bg-black/50'
    >
      <div className='space-y-6'>
        <div className='space-y-2 text-center'>
          <h2 className='text-2xl font-bold text-gray-900'>ユーザー名の登録</h2>
          <p className='text-sm text-gray-500'>
            あなたの表示名を入力してください
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='name' className='text-sm font-medium text-gray-700'>
              ユーザー名
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className={twMerge(
                'w-full rounded-xl',
                'px-4 py-3.5',
                'text-base font-medium text-gray-700',
                'bg-white',
                'border border-orange-100',
                'outline-none',
                'focus:border-transparent',
                'focus:ring-2 focus:ring-orange-500/20',
                'focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]',
                'placeholder:text-gray-400',
                'transition-shadow duration-200',
                'shadow-sm',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
              placeholder='ユーザー名を入力'
              required
            />
          </div>

          <div className='flex gap-3'>
            <motion.button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className={twMerge(
                'flex-1',
                'px-4 py-3.5',
                'bg-gray-100',
                'text-gray-700 font-medium',
                'rounded-xl',
                'hover:bg-gray-200',
                'focus:outline-none focus:ring-2 focus:ring-gray-500/20',
                'transition-all duration-200',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
              whileHover={
                isSubmitting ? undefined : loginAnimations.button.hover
              }
              whileTap={isSubmitting ? undefined : loginAnimations.button.tap}
            >
              キャンセル
            </motion.button>

            <motion.button
              type='submit'
              disabled={isSubmitting || !name.trim()}
              className={twMerge(
                'flex-1',
                'px-4 py-3.5',
                'bg-gradient-to-r from-orange-500 to-amber-500',
                'text-white font-medium',
                'rounded-xl',
                'hover:from-orange-600 hover:to-amber-600',
                'focus:outline-none focus:ring-2 focus:ring-orange-500/20',
                'transition-all duration-200',
                'relative',
                (isSubmitting || !name.trim()) &&
                  'opacity-50 cursor-not-allowed'
              )}
              whileHover={
                isSubmitting || !name.trim()
                  ? undefined
                  : loginAnimations.button.hover
              }
              whileTap={
                isSubmitting || !name.trim()
                  ? undefined
                  : loginAnimations.button.tap
              }
            >
              {isSubmitting ? (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <CircleNotch size={24} className='animate-spin' />
                </div>
              ) : (
                '登録'
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
