import { ScannedProduct } from "@/app/home/page";


export type Store = {
    id: string;
    name: string;
}

export type ProductPrice = {
    id: number;
    price: number;
    store: {
        id: number;
        name: string;
    };
    updatedAt: string;
}

export type AddProductModalProps = {
    /** モーダルの表示状態 */
    isOpen: boolean;
    /** モーダルを閉じる関数 */
    onClose: () => void;
    /** メーカー名 */
    makerName?: string;
    /** ブランド名 */
    brandName?: string;
    /** 商品名 */
    name: string;
    /** バーコード */
    barcode: string;
    /** 商品画像URL */
    imageUrl: string;
    /** 商品情報信時のコールバック */
    onSubmit: (data: { storeId: number; price: number }) => void;
    /** 商品が登録済みかどうか */
    isRegistered: boolean;
    /** スキャンした商品の価格情報 */
    scannedProduct: ScannedProduct | null;
    /** 店舗選択時のコールバック */
    onStoreSelect?: (storeId: string) => void;
}