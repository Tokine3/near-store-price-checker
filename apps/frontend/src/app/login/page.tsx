'use client';

import { FC, useEffect } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { SignIn, CircleNotch } from '@phosphor-icons/react';
import { loginAnimations } from './_styles/animations';
import { LoginForm } from './_components';
import { useLogin } from './_hooks';
import { NameRegistrationModal } from './_components/NameRegistrationModal';
import Modal from 'react-modal';

const LoginPage: FC = () => {
    const { login, isLoading, showNameModal, registerUser, setShowNameModal } = useLogin();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            Modal.setAppElement('body');
        }
    }, []);

    const handleLogin = async (email: string, password: string) => {
        try {
            await login(email, password);
        } catch (error) {
            throw error;
        }
    };

    return (
        <>
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
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <motion.div 
                                className="flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg"
                                variants={loginAnimations.icon}
                                initial="initial"
                                animate="animate"
                            >
                                <SignIn size={28} weight="duotone" color="#FFFFFF" />
                            </motion.div>
                            <div className="flex flex-col items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                                    ログイン
                                </h1>
                                <p className="text-sm text-orange-600/70">
                                    アカウント情報を入力してください
                                </p>
                            </div>
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
            <NameRegistrationModal
                isOpen={showNameModal}
                onClose={() => setShowNameModal(false)}
                onSubmit={registerUser}
                onError={() => {}}
            />
<<<<<<< HEAD
          </div>
        </motion.div>
      </div>
      <NameRegistrationModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSubmit={(name) => registerUser(name, handleLoginSuccess)}
        onError={() => {}}
      />
    </>
  );
};
=======
        </>
    );
}
>>>>>>> parent of 9fe3055 (google login 実装)

export default LoginPage;