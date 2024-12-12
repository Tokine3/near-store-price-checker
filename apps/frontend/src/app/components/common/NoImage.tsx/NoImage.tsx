import { ImageSquare } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

type NoImageProps = {
    className?: string;
    size?: number;
};

export const NoImage: React.FC<NoImageProps> = ({ className, size = 40 }) => {
    return (
        <div className={twMerge(
        "w-full h-full",
        "bg-white rounded-lg",
        "flex items-center justify-center",
        "border border-orange-100",
        className
        )}>
        <div className="flex flex-col items-center gap-1">
            <ImageSquare weight="duotone" size={size} color="#FBBA74" />
            <span className="text-xs text-gray-500">NO IMAGE</span>
        </div>
        </div>
    );
};