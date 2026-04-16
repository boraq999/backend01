import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../core/base.entity';
import { TransactionType, PaymentMethod } from '../../../shared/enums';
import { CashAccount } from '../cash-accounts/cash-account.entity';

@Entity('payment_transactions')
export class PaymentTransaction extends BaseEntity {
  @Column('binary', { length: 16, name: 'cash_account_id' })
  cashAccountId: Buffer;

  @ManyToOne(() => CashAccount)
  @JoinColumn({ name: 'cash_account_id' })
  cashAccount: CashAccount;

  @Column({
    type: 'enum',
    enum: TransactionType,
    name: 'transaction_type',
  })
  transactionType: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    name: 'payment_method',
  })
  paymentMethod: PaymentMethod;

  @Column('binary', { length: 16, name: 'reference_id', nullable: true })
  referenceId: Buffer;

  @Column({ length: 50, name: 'reference_type', nullable: true })
  referenceType: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column({ type: 'date', name: 'transaction_date' })
  transactionDate: Date;
}