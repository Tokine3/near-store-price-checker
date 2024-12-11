import { FC } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { GoogleLogo } from '@phosphor-icons/react';
import { GoogleLoginButtonProps } from '../../_types';
import { loginAnimations } from '../../_styles/animations';

export const GoogleLoginButton: FC<GoogleLoginButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={twMerge(
        "w-full",
        "flex items-center justify-center gap-2",
        "px-4 py-2.5",
        "bg-white",
        "text-gray-700 font-medium",
        "rounded-xl",
        "border border-orange-100",
        "hover:bg-orange-50",
        "focus:outline-none focus:ring-2 focus:ring-orange-500/20",
        "transition-all duration-200",
        "shadow-sm"
      )}
      whileHover={loginAnimations.button.hover}
      whileTap={loginAnimations.button.tap}
    >
      <GoogleLogo weight="bold" size={20} color="#4285F4" />
      Googleでログイン
    </motion.button>
  );
};