import { FC, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { MagnifyingGlass, Storefront, CaretUpDown, Check, X } from '@phosphor-icons/react';
import Modal from 'react-modal';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

type ProductSearchModalProps = {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSearch: () => void;
    selectedSearchStoreId: string;
    setSelectedSearchStoreId: (id: string) => void;
    stores: Array<{ id: string; name: string }>;
};

/**
 * 商品検索モーダルコンポーネント
 * @description 商品を検索するためのモーダル
 */
const ProductSearchModal: FC<ProductSearchModalProps> = ({
    isOpen,
    onClose,
    searchTerm,
    setSearchTerm,
    handleKeyDown,
    handleSearch,
    selectedSearchStoreId,
    setSelectedSearchStoreId,
    stores,
}) => {
    const handleSearchAndClose = () => {
        handleSearch();
        onClose();
    };

    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
        >
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            {/* 閉じるボタン */}
            <motion.button
            type="button"
            onClick={onClose}
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
                <div className="hidden sm:block">
                <MagnifyingGlass 
                    size={28}  // sm:h-7 w-7 (7 * 4 = 28px)
                    weight="duotone"
                    color="#FFFFFF"  // text-white
                />
                </div>
                <div className="sm:hidden">
                <MagnifyingGlass 
                    size={24}  // h-6 w-6 (6 * 4 = 24px)
                    weight="duotone"
                    color="#FFFFFF"  // text-white
                />
                </div>
            </motion.div>
            <motion.div 
                className="flex flex-col items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600">
                商品検索
                </h2>
                <p className="text-xs sm:text-sm text-orange-600/70">
                商品名を入力してください
                </p>
            </motion.div>
            </div>

            <div className="relative flex-1 max-w-lg mx-auto mb-4 mt-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlass weight="duotone" size={20} color="#FB923C" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="商品名を入力"
                className={twMerge(
                "block w-full",
                "pl-10 pr-3 py-3",
                "text-base font-medium text-gray-700",
                "bg-white",
                "border border-orange-100 rounded-xl",
                "outline-none",
                "focus:border-transparent",
                "focus:ring-2 focus:ring-orange-500/20",
                "placeholder:text-gray-400",
                "transition-all duration-200",
                "shadow-sm"
                )}
            />
            </div>
            <div className="relative max-w-lg mx-auto mb-4">
            <Listbox value={selectedSearchStoreId} onChange={setSelectedSearchStoreId}>
                <div className="relative">
                <Listbox.Button className={twMerge(
                    "relative w-full cursor-default",
                    "rounded-xl bg-white py-3 pl-10 pr-10",
                    "border border-orange-100",
                    "outline-none",
                    "focus:border-transparent",
                    "focus:ring-2 focus:ring-orange-500/20",
                    "transition-all duration-200",
                    "shadow-sm"
                )}>
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Storefront weight="duotone" size={20} color="#FB923C" />
                    </span>
                    <span className="block truncate text-base font-medium text-gray-700">
                    {stores.find((store) => store.id === selectedSearchStoreId)?.name || '店舗を選択'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <CaretUpDown weight="bold" size={20} color="#FB923C" />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {stores.map((store) => (
                        <Listbox.Option
                        key={store.id}
                        value={store.id}
                        className={({ active }) => twMerge(
                            "relative cursor-default select-none py-2 pl-10 pr-4",
                            active ? "bg-orange-50 text-orange-600" : "text-gray-700"
                        )}
                        >
                        {({ selected }) => (
                            <>
                            <span className={twMerge(
                                "block truncate",
                                selected ? "font-medium" : "font-normal"
                            )}>
                                {store.name}
                            </span>
                            {selected && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500">
                                <Check weight="bold" size={20} />
                                </span>
                            )}
                            </>
                        )}
                        </Listbox.Option>
                    ))}
                    </Listbox.Options>
                </Transition>
                </div>
            </Listbox>
            </div>
            <div className="flex justify-end">
            <button
                onClick={handleSearchAndClose}
                className={twMerge(
                "inline-flex items-center justify-center gap-2",
                "px-4 py-2.5",
                "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
                "border border-transparent rounded-xl",
                "outline-none",
                "hover:from-orange-600 hover:to-amber-600",
                "focus:ring-2 focus:ring-orange-500/20",
                "transition-all duration-200"
                )}
            >
                <MagnifyingGlass size={20} weight="bold" color="#FFFFFF" />
                検索
            </button>
            </div>
        </div>
        </Modal>
    );
};

export default ProductSearchModal;