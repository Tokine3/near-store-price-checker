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
    )
};