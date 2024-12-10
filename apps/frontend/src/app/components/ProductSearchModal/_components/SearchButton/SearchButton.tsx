import { FC } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

type SearchButtonProps = {
    onClick: () => void;
};

export const SearchButton: FC<SearchButtonProps> = ({ onClick }) => {
    return (
        <div className="flex justify-end">
        <button
            onClick={onClick}
            className={twMerge(
            "inline-flex items-center justify-center",
            "px-4 py-2.5",
            "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
            "border border-transparent rounded-xl",
            "outline-none",
            "hover:from-orange-600 hover:to-amber-600",
            "focus:ring-2 focus:ring-orange-500/20",
            "transition-all duration-200",
            "flex-1 sm:flex-initial"
            )}
        >
            <MagnifyingGlass size={20} weight="bold" color="#FFFFFF" />
            検索
        </button>
        </div>
    );
};