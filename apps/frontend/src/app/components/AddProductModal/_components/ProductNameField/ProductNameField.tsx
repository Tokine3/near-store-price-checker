import { FC } from 'react';
import { PencilSimple } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

type ProductNameFieldProps = {
    name: string;
    isEditing: boolean;
    onEditToggle: () => void;
    onChange: (value: string) => void;
};

export const ProductNameField: FC<ProductNameFieldProps> = ({
    name,
    isEditing,
    onEditToggle,
    onChange,
}) => {
    return (
        <div className="relative flex items-center gap-2">
        {isEditing ? (
            <input
            type="text"
            value={name}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onEditToggle}
            className={twMerge(
                "w-full",
                "px-3 py-2",
                "text-base font-medium text-gray-700",
                "bg-white",
                "border border-orange-100 rounded-lg",
                "outline-none",
                "focus:border-transparent",
                "focus:ring-2 focus:ring-orange-500/20",
                "transition-all duration-200"
            )}
            autoFocus
            formNoValidate
            />
        ) : (
            <span className="text-base font-medium text-gray-700">{name}</span>
        )}
        <button
            type="button"
            onClick={onEditToggle}
            className={twMerge(
            "p-1.5 rounded-lg",
            "hover:bg-orange-50",
            "transition-colors",
            isEditing && "bg-orange-50"
            )}
        >
            <PencilSimple
            size={20}
            weight="duotone"
            color="#FB923C"
            />
        </button>
        </div>
    );
};