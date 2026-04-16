import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction } from './payment-transaction.entity';
import { TransactionType, PaymentMethod } from '../../../shared/enums';
import { UuidHelper } from '../../../common/uuid.helper';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashAccountModule } from '../cash-accounts/cash-account.module';

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
