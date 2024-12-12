import { FC } from 'react';
import { motion } from 'framer-motion';
import { Plus } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';
import type { PriceAddButtonProps } from './types';

export const PriceAddButton: FC<PriceAddButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
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
  );
};
