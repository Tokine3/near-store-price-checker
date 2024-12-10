import { FC } from 'react';
import { ProductSearchModalProps } from './_types';
import { AnimatePresence,  } from 'framer-motion';
import { CloseButton, ModalHeader, SearchButton, SearchInput, StoreSelect } from './_components';
import { DialogContainer } from '../BarCodeReaderModal/_components';
import { CancelButton } from '../common/CancelButton';

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
        <DialogContainer isOpen={isOpen} onClose={onClose}>
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
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                <CancelButton onClick={onClose} />
                <SearchButton onClick={handleSearchAndClose} />
            </div>
            </DialogContainer>
        )}
    </AnimatePresence>
    );
};