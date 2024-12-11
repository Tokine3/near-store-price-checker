import { FC, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Modal from 'react-modal';
import { User } from '@phosphor-icons/react';
import { ModalHeader } from './_components/ModalHeader';
import { FormActions } from './_components/FormActions';

type NameRegistrationModalProps = {
    isOpen: boolean;
    onSubmit: (name: string) => Promise<void>;
    onError?: () => void;
    onClose: () => void;
};

export const NameRegistrationModal: FC<NameRegistrationModalProps> = ({ 
    isOpen, 
    onSubmit, 
    onError,
    onClose 
}) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setName('');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('名前を入力してください');
            return;
        }
        try {
            await onSubmit(name.trim());
        } catch(error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('申し訳ありません。ユーザー登録処理中にエラーが発生しました。\nもう一度お試しください。');
            }
            onError?.();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-orange-100"
            overlayClassName="fixed inset-0 bg-black/50"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <ModalHeader />
                <div className="space-y-2">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <User weight="duotone" size={20} color="#FB923C" />
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            className={twMerge(
                                "w-full rounded-xl",
                                "pl-12 py-3.5",
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
                            placeholder="名前を入力してください"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500 mt-1 whitespace-pre-line font-bold">{error}</p>
                    )}
                </div>
                <FormActions onCancel={onClose} />
            </form>
        </Modal>
    );
};