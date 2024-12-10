export type ModalProps = {
    /** モーダルの表示状態 */
    isOpen: boolean;
    /** モーダルを閉じる関数 */
    onClose: () => void;
};

export type StoreNameInputProps = {
    storeName: string;
    onChange: (value: string) => void;
};

export type FormActionsProps = {
    onCancel: () => void;
};