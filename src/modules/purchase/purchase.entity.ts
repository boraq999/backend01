import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { PurchaseStatus, PurchaseSourceType } from '../../shared/enums';
import { Supplier } from '../supplier/supplier.entity';

@Entity('purchases')
export class Purchase extends BaseEntity {
  @Column('binary', { length: 16, name: 'supplier_id' })
  supplierId: Buffer;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.DRAFT,
  })
  status: PurchaseStatus;

  @Column({
    type: 'enum',
    enum: PurchaseSourceType,
    name: 'source_type',
    default: PurchaseSourceType.EXTERNAL_SUPPLIER,
  })
  sourceType: PurchaseSourceType;

  @Column('text', { nullable: true })
  notes: string;

  @OneToMany(() => PurchaseItem, (item) => item.purchase, { cascade: true })
  items: PurchaseItem[];
}

@Entity('purchase_items')
export class PurchaseItem extends BaseEntity {
  @Column('binary', { length: 16, name: 'purchase_id' })
  purchaseId: Buffer;

  @ManyToOne(() => Purchase, (purchase) => purchase.items)
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase;

  @Column('binary', { length: 16, name: 'product_id' })
  productId: Buffer;

  @Column('decimal', { precision: 10, scale: 3 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;
}
