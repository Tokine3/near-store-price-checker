import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/config';
import axios from 'axios';
import { FirebaseError } from 'firebase/app';

export const useLogin = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
    
            const response = await axios.post('http://localhost:8000/auth/verify', {
                token: idToken
            });
            document.cookie = `auth-token=${response.data.token}; path=/; max-age=${60 * 60 * 24 * 5}`;
            router.push('/home');
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
                    throw new Error('メールアドレスが正しくありません');
                } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    throw new Error('パスワードが正しくありません');
                }
            }
            throw new Error('ログインに失敗しました');
        } finally {
            setIsLoading(false);
        }
    };

    const googleLogin = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const response = await axios.post('http://localhost:8000/auth/verify', {
                token: idToken
            });
            console.log('RESPONSE DONE')

            document.cookie = `auth-token=${response.data.token}; path=/; max-age=${60 * 60 * 24 * 5}`;
            toast.success('ログインしました');
            router.push('/home');
        } catch (error: unknown) {
            console.error('Google login error:', error);
            if (error instanceof Error && 'code' in error && error.code === 'auth/popup-closed-by-user') {
                toast.error('ログインがキャンセルされました');
            } else {
                toast.error('ログインに失敗しました');
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login,
        googleLogin,
        isLoading,
    };
};