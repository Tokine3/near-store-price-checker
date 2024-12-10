import { FC } from 'react';
import Modal from 'react-modal';
import { modalStyles, modalAnimations } from './_styles';
import { ProductSearchModalProps } from './_types';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseButton, ModalHeader, SearchButton, SearchInput, StoreSelect } from './_components';

export const ProductSearchModal: FC<ProductSearchModalProps> = ({
    isOpen,
    onClose,
    searchTerm,
    setSearchTerm,
    handleKeyDown,
    handleSearch,
    selectedSearchStoreId,
    setSelectedSearchStoreId,
    stores,
}) => {
    const handleSearchAndClose = () => {
        handleSearch();
        onClose();
    };
    
    return (
    <AnimatePresence>
        {isOpen && (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={modalStyles.container}
            overlayClassName={modalStyles.overlay}
            ariaHideApp={false}
        >
            <motion.div
            className="relative"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalAnimations.content}
            >
            <CloseButton onClose={onClose} />
            <ModalHeader />
            <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleKeyDown={handleKeyDown}
            />
            <StoreSelect
                selectedSearchStoreId={selectedSearchStoreId}
                setSelectedSearchStoreId={setSelectedSearchStoreId}
                stores={stores}
            />
            <SearchButton onClick={handleSearchAndClose} />
            </motion.div>
        </Modal>
        )}
    </AnimatePresence>
    );
};