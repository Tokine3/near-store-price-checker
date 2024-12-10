import { twMerge } from 'tailwind-merge';

export const modalStyles = {
    overlay: twMerge(
        "fixed inset-0",
        "bg-black bg-opacity-50",
        "flex items-center justify-center",
        "p-4"
    ),
    container: twMerge(
        "relative w-full max-w-md",
        "bg-white rounded-2xl",
        "shadow-xl",
        "p-4 sm:p-6"
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
    button: {
        base: twMerge(
        "flex-1 sm:flex-initial",
        "inline-flex items-center justify-center",
        "px-4 py-2.5",
        "border rounded-xl",
        "outline-none",
        "transition-all duration-200"
        ),
        cancel: twMerge(
        "bg-white text-gray-600",
        "border-gray-200",
        "hover:bg-gray-50",
        "focus:border-transparent",
        "focus:ring-2 focus:ring-red-500/20",
        "focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]"
        ),
        submit: twMerge(
        "bg-orange-500 text-white",
        "border-transparent",
        "hover:bg-orange-600",
        "focus:border-transparent",
        "focus:ring-2 focus:ring-orange-500/20",
        "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]"
        )
    }
};