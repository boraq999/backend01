import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column('text', { nullable: true })
  address: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column('text', { nullable: true })
  notes: string;
}
