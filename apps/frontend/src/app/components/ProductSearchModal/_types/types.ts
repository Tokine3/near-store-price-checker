export type Store = {
    id: string;
    name: string;
};

export type ProductSearchModalProps = {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSearch: () => void;
    selectedSearchStoreId: string;
    setSelectedSearchStoreId: (id: string) => void;
    stores: Store[];
};