import { Variants } from 'framer-motion';

export const modalAnimations = {
    overlay: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    },
    content: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    },
    icon: {
        initial: { scale: 0.8 },
        animate: { 
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 10 }
        },
    },
    text: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { delay: 0.2 } },
    },
    form: {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { delay: 0.3 } },
    },
    button: {
        hover: { scale: 1.02 },
        tap: { scale: 0.98 }
    }
} satisfies Record<string, Variants>;