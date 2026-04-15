import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { SaleStatus } from '../../shared/enums';
import { Customer } from '../customer/customer.entity';

@Entity('sales')
export class Sale extends BaseEntity {
  @Column('binary', { length: 16, name: 'customer_id', nullable: true })
  customerId: Buffer;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'paid_amount', default: 0 })
  paidAmount: number;

  @Column({
    type: 'enum',
    enum: SaleStatus,
    default: SaleStatus.DRAFT,
  })
  status: SaleStatus;

  @Column('text', { nullable: true })
  notes: string;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: true })
  items: SaleItem[];
}

@Entity('sale_items')
export class SaleItem extends BaseEntity {
  @Column('binary', { length: 16, name: 'sale_id' })
  saleId: Buffer;

  @ManyToOne(() => Sale, (sale) => sale.items)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column('binary', { length: 16, name: 'product_id' })
  productId: Buffer;

  @Column('decimal', { precision: 10, scale: 3 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'unit_price' })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;
}
