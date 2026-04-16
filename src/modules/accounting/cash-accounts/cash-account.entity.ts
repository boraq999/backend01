import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../core/base.entity';

@Entity('cash_accounts')
export class CashAccount extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column('text', { nullable: true })
  description: string;
}