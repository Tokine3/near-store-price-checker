'use client';

import { FC, useState } from 'react';
import { Envelope, Lock } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';
import { loginAnimations } from '../../_styles';
import { GoogleLoginButton } from '../GoogleLoginButton';

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => void;
};

export const LoginForm: FC<LoginFormProps> = ({ onSubmit, onGoogleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'メールアドレスが正しくありません';
    }

    if (!password) {
      newErrors.password = 'パスワードを入力してください';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(email, password);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'メールアドレスが正しくありません') {
            setErrors((prev) => ({
              ...prev,
              email: error.message,
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              password: error.message,
            }));
          }
        }
      }
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <form onSubmit={handleSubmit} className='space-y-6' noValidate>
        <div className='space-y-2'>
          <label htmlFor='email' className='text-sm font-medium text-gray-700'>
            メールアドレス
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
              <Envelope
                weight='duotone'
                size={20}
                color={errors.email ? '#EF4444' : '#FB923C'}
              />
            </div>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className={twMerge(
                'w-full rounded-xl',
                'pl-12 py-3.5',
                'text-base font-medium text-gray-700',
                'bg-white',
                'border',
                errors.email ? 'border-red-500' : 'border-orange-100',
                'outline-none',
                'focus:border-transparent',
                'focus:ring-2',
                errors.email
                  ? 'focus:ring-red-500/20'
                  : 'focus:ring-orange-500/20',
                errors.email
                  ? 'focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]'
                  : 'focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]',
                'placeholder:text-gray-400',
                'transition-shadow duration-200',
                'shadow-sm'
              )}
              placeholder='メールアドレスを入力してください'
            />
          </div>
          {errors.email && (
            <p className='text-sm text-red-500 mt-1'>{errors.email}</p>
          )}
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='password'
            className='text-sm font-medium text-gray-700'
          >
            パスワード
          </label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
              <Lock
                weight='duotone'
                size={20}
                color={errors.password ? '#EF4444' : '#FB923C'}
              />
            </div>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: '' }));
              }}
              className={twMerge(
                'w-full rounded-xl',
                'pl-12 py-3.5',
                'text-base font-medium text-gray-700',
                'bg-white',
                'border',
                errors.password ? 'border-red-500' : 'border-orange-100',
                'outline-none',
                'focus:border-transparent',
                'focus:ring-2',
                errors.password
                  ? 'focus:ring-red-500/20'
                  : 'focus:ring-orange-500/20',
                errors.password
                  ? 'focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]'
                  : 'focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]',
                'placeholder:text-gray-400',
                'transition-shadow duration-200',
                'shadow-sm'
              )}
              placeholder='パスワードを入力してください'
            />
          </div>
          {errors.password && (
            <p className='text-sm text-red-500 mt-1'>{errors.password}</p>
          )}
        </div>

        <motion.button
          type='submit'
          className={twMerge(
            'w-full',
            'px-4 py-3.5',
            'bg-gradient-to-r from-orange-500 to-amber-500',
            'text-white font-medium',
            'rounded-xl',
            'hover:from-orange-600 hover:to-amber-600',
            'focus:outline-none focus:ring-2 focus:ring-orange-500/20',
            'transition-all duration-200'
          )}
          whileHover={loginAnimations.button.hover}
          whileTap={loginAnimations.button.tap}
        >
          ログイン
        </motion.button>
      </form>

      <div className='relative my-4'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-300' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <span className='px-2 text-gray-500 bg-white'>または</span>
        </div>
      </div>

      <GoogleLoginButton onClick={onGoogleLogin} />
    </div>
  );
};
