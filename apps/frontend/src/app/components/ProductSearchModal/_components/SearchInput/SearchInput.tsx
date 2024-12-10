import { FC } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

type SearchInputProps = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const SearchInput: FC<SearchInputProps> = ({
    searchTerm,
    setSearchTerm,
    handleKeyDown
}) => {
    return (
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
  );
};