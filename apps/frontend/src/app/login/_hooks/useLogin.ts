import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { api } from '@/lib/axios';
import { FirebaseError } from 'firebase/app';

export const useLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const checkUserExists = async () => {
    try {
      const response = await api.get('/users/me');
      return !!response.data;
    } catch {
      return false;
    }
  };

  const clearAuthAndRedirect = () => {
    document.cookie =
      'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'uid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const registerUser = async (name: string, onSuccess?: () => void) => {
    try {
      const response = await api.post('/users', {
        name: name,
        email: userEmail,
      });

      const registeredUser = response.data;
      if (!registeredUser) {
        throw new Error('ユーザー登録に失敗しました');
      }

      toast.success('ユーザー登録が完了しました');
      setShowNameModal(false); // モーダルを閉じる
      onSuccess?.(); // 成功時のコールバックを実行
      router.push('/home');
    } catch {
      const errorMessage = 'ユーザー登録に失敗しました';
      clearAuthAndRedirect();
      throw new Error(errorMessage);
    }
  };
  const handleGoogleLogin = async (
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      // カスタムパラメータの設定を調整
      provider.setCustomParameters({
        prompt: 'select_account',
        display: 'popup',
      });

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const uid = result.user.uid;
      const email = result.user.email;

      if (!email) {
        throw new Error('メールアドレスの取得に失敗しました');
      }

      // バックエンドでトークンを検証
      const response = await api.post('/auth/verify', {
        token: idToken,
      });

      const MAX_AGE = 60 * 60 * 24 * 5;
      document.cookie = `auth-token=${response.data.token}; path=/; max-age=${MAX_AGE}`;
      document.cookie = `uid=${uid}; path=/; max-age=${MAX_AGE}`;

      setUserEmail(email);

      // ユーザーの存在確認
      const userExists = await checkUserExists();

      if (!userExists) {
        setShowNameModal(true); // 新規ユーザーの場合はモーダルを表示
      } else {
        await api.patch('users/login');
        toast.success('ログインしました');
        setShowNameModal(false);
        onSuccess?.();
        router.push('/home'); // 既存ユーザーの場合のみリダイレクト
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error instanceof Error) {
        // ポップアップを閉じた場合は特別なメッセージを表示
        if (error.message.includes('popup-closed-by-user')) {
          toast.info('ログインがキャンセルされました');
          return;
        }
        onError?.(error);
      }
      toast.error('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;

      setUserEmail(email);

      const response = await api.post('/auth/verify', {
        token: idToken,
      });
      const MAX_AGE = 60 * 60 * 24 * 5;
      document.cookie = `auth-token=${response.data.token}; path=/; max-age=${MAX_AGE}`;
      document.cookie = `uid=${uid}; path=/; max-age=${MAX_AGE}`;

      const userExists = await checkUserExists();

      if (!userExists) {
        setShowNameModal(true);
      } else {
        await api.patch('users/login');
        toast.success('ログインしました');
        router.push('/home');
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (
          error.code === 'auth/invalid-email' ||
          error.code === 'auth/user-not-found'
        ) {
          throw new Error('メールアドレスが正しくありません');
        } else if (
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
        ) {
          throw new Error('パスワードが正しくありません');
        }
      }
      throw new Error('ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    showNameModal,
    setShowNameModal,
    registerUser,
    handleGoogleLogin,
    userEmail,
    setUserEmail,
  };
};
