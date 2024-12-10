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
    )
};