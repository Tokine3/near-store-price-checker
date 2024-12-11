export const modalAnimations = {
    icon: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
    },
    text: {
        initial: { y: 10, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.1 } }
    },
    button: {
        hover: { scale: 1.02 },
        tap: { scale: 0.98 }
    }
};