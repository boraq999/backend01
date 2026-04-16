import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

@Entity('expenses')
export class Expense extends BaseEntity {
  @Column({ length: 100 })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 50, nullable: true })
  category: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column({ type: 'date', name: 'expense_date' })
  expenseDate: Date;
}