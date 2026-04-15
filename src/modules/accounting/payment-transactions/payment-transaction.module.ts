import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../core/base.entity';
import { TransactionType, PaymentMethod } from '../../../shared/enums';
import { CashAccount } from '../cash-accounts/cash-account.module';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UuidHelper } from '../../../common/uuid.helper';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashAccountModule } from '../cash-accounts/cash-account.module';

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

export class CreatePaymentTransactionDto {
  cashAccountId: string;
  transactionType: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  transactionDate?: Date;
}

@Injectable()
export class PaymentTransactionService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private transactionRepository: Repository<PaymentTransaction>,
  ) {}

  async create(dto: CreatePaymentTransactionDto): Promise<PaymentTransaction> {
    const transaction = this.transactionRepository.create({
      cashAccountId: UuidHelper.toBinary(dto.cashAccountId),
      transactionType: dto.transactionType,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      referenceId: dto.referenceId ? UuidHelper.toBinary(dto.referenceId) : undefined,
      referenceType: dto.referenceType,
      notes: dto.notes,
      transactionDate: dto.transactionDate || new Date(),
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<PaymentTransaction[]> {
    return await this.transactionRepository.find({
      relations: ['cashAccount'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findByCashAccount(cashAccountId: string): Promise<PaymentTransaction[]> {
    return await this.transactionRepository.find({
      where: { cashAccountId: UuidHelper.toBinary(cashAccountId) },
      relations: ['cashAccount'],
      order: { transactionDate: 'DESC' },
    });
  }
}

@Controller('payment-transactions')
export class PaymentTransactionController {
  constructor(
    private readonly transactionService: PaymentTransactionService,
  ) {}

  @Post()
  create(@Body() dto: CreatePaymentTransactionDto) {
    return this.transactionService.create(dto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get('cash-account/:id')
  findByCashAccount(@Param('id') id: string) {
    return this.transactionService.findByCashAccount(id);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransaction]), CashAccountModule],
  controllers: [PaymentTransactionController],
  providers: [PaymentTransactionService],
  exports: [PaymentTransactionService],
})
export class PaymentTransactionModule {}
