import { Variants } from 'framer-motion';

export const modalAnimations = {
    overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    },
    content: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
        exit: { opacity: 0, y: 20, transition: { duration: 0.2 } }
    }
} satisfies Record<string, Variants>;

export const iconAnimations = {
    container: {
        initial: { scale: 0.8 },
        animate: { 
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 15 }
        },
    },
    text: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { delay: 0.2 } },
    }
} satisfies Record<string, Variants>;

export const buttonAnimations = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
} satisfies Variants;