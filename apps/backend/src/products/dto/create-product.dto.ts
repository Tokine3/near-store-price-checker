export class CreateProductDto {
  name: string;
  brandName?: string;
  makerName?: string;
  barcode: string;
  price: number;
  storeId: number;
}
