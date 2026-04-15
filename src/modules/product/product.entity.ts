import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { ProductStatus } from '../../shared/enums';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 50, unique: true })
  sku: string;

  @Column({ length: 20, nullable: true })
  barcode: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2, name: 'purchase_price' })
  purchasePrice: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'sale_price' })
  salePrice: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column({ length: 20, nullable: true })
  unit: string;
}
