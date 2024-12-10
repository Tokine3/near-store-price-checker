import { twMerge } from 'tailwind-merge';

type ModalClassNames = {
    container: string;
    overlay: string;
    content: string;
    form: string;
};

export const modalClassNames: ModalClassNames = {
    container: twMerge(
        "w-full max-w-md mx-auto",
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "max-h-[90vh]",
        "overflow-y-auto",
        "bg-white rounded-2xl shadow-xl",
        "p-4 sm:p-6",
        "sm:max-w-lg md:max-w-xl lg:max-w-2xl"
    ),
    overlay: twMerge(
        "fixed inset-0",
        "bg-black/30 backdrop-blur-sm",
        "overflow-y-auto",
        "flex items-center justify-center",
        "p-4"
    ),
    content: twMerge(
        "flex flex-col gap-4 sm:gap-6"
    ),
    form: twMerge(
        "flex flex-col gap-4 sm:gap-6"
    )
};