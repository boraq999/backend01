import { ProductStatus } from '../../shared/enums';

export class CreateProductDto {
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  purchasePrice: number;
  salePrice: number;
  category?: string;
  unit?: string;
}

export class UpdateProductDto {
  name?: string;
  barcode?: string;
  description?: string;
  purchasePrice?: number;
  salePrice?: number;
  status?: ProductStatus;
  category?: string;
  unit?: string;
}
