import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { InventoryEventType } from '../../shared/enums';
import { Product } from '../product/product.entity';

@Entity('inventory_events')
export class InventoryEvent extends BaseEntity {
  @Column('binary', { length: 16, name: 'branch_id' })
  branchId: Buffer;

  @Column({
    type: 'enum',
    enum: InventoryEventType,
    name: 'event_type',
  })
  eventType: InventoryEventType;

  @Column('binary', { length: 16, name: 'product_id' })
  productId: Buffer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('decimal', { precision: 10, scale: 3 })
  quantity: number;

  @Column('binary', { length: 16, name: 'reference_id', nullable: true })
  referenceId: Buffer;

  @Column({ length: 50, name: 'reference_type', nullable: true })
  referenceType: string;

  @Column('text', { nullable: true })
  notes: string;
}
