import { twMerge } from 'tailwind-merge';

export const modalStyles = {
    overlay: twMerge(
        "fixed inset-0",
        "bg-black/30 backdrop-blur-sm"
    ),
    container: twMerge(
        "relative w-full",
        "bg-white rounded-2xl shadow-xl",
        "p-4 sm:p-6"
    ),
    panel: twMerge(
        "w-full max-w-lg mx-auto",
        "mt-10 sm:mt-20 p-4"
    ),
    input: twMerge(
        "w-full rounded-xl",
        "pl-10 py-2.5",
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
    ),
};