'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { loginAnimations } from './_styles/animations';
import { LoginForm } from './_components';
import { useLogin } from './_hooks';
import { CircleNotch } from '@phosphor-icons/react';

const LoginPage: FC = () => {
    const { login, isLoading } = useLogin();

    const handleLogin = async (email: string, password: string) => {
        try {
            await login(email, password);
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
            <motion.div
                className={twMerge(
                    "w-full max-w-xl",
                    "bg-white rounded-2xl",
                    "shadow-xl",
                    "border border-orange-100",
                    "relative"
                )}
                {...loginAnimations.container}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl z-50">
                            <div className="animate-spin">
                                <CircleNotch size={32} color="#F97316" />
                            </div>
                    </div>
                )}
                {/* ヘッダー */}
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                            ログイン
                        </h1>
                        <p className="text-sm text-orange-600/70">
                            アカウント情報を入力してください
                        </p>
                    </div>
                </div>

                {/* ボーダー */}
                <div className="px-6 sm:px-8">
                    <div className="w-full h-px bg-orange-100" />
                </div>

                {/* コンテンツ */}
                <div className="p-6 sm:p-8">
                    <LoginForm onSubmit={handleLogin} />
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;