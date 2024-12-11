export const loginAnimations = {
    container: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
    },
    icon: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { 
            type: "spring",
            stiffness: 200,
            damping: 15
        }
    },
    text: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1, duration: 0.2 }
    },
    button: {
        hover: { scale: 1.02 },
        tap: { scale: 0.98 }
    }
};