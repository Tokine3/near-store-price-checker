import { FC, ReactNode } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalStyles, modalAnimations } from '../../_styles';

type DialogContainerProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const DialogContainer: FC<DialogContainerProps> = ({
    isOpen,
    onClose,
    children
}) => {
    return (
        <AnimatePresence>
        {isOpen && (
            <Dialog
            open={isOpen}
            onClose={onClose}
            className="relative z-50"
            >
            <motion.div 
                className={modalStyles.overlay}
                {...modalAnimations.overlay}
                aria-hidden="true" 
            />
            
            <div className="fixed inset-0 flex items-start justify-center overflow-y-auto">
                <div className={modalStyles.panel}>
                <Dialog.Panel>
                    <motion.div
                    className={modalStyles.container}
                    {...modalAnimations.content}
                    >
                    {children}
                    </motion.div>
                </Dialog.Panel>
                </div>
            </div>
            </Dialog>
        )}
        </AnimatePresence>
    );
};