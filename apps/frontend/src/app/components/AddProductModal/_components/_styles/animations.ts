export const headerAnimations = {
    icon: {
        initial: { scale: 0.8 },
        animate: { scale: 1 },
        transition: { type: "spring", stiffness: 200, damping: 15 }
    },
    text: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.2 }
    }
};

export const modalAnimations = {
    container: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.3 }
    }
};