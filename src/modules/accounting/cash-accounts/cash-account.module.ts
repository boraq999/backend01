import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../core/base.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UuidHelper } from '../../../common/uuid.helper';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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

export class CreateCashAccountDto {
  name: string;
  balance?: number;
  description?: string;
}

@Injectable()
export class CashAccountService {
  constructor(
    @InjectRepository(CashAccount)
    private cashAccountRepository: Repository<CashAccount>,
  ) {}

  async create(dto: CreateCashAccountDto): Promise<CashAccount> {
    const account = this.cashAccountRepository.create(dto);
    return await this.cashAccountRepository.save(account);
  }

  async findAll(): Promise<CashAccount[]> {
    return await this.cashAccountRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<CashAccount | null> {
    return await this.cashAccountRepository.findOne({
      where: { id: UuidHelper.toBinary(id) },
    });
  }

  async updateBalance(id: string, amount: number): Promise<void> {
    await this.cashAccountRepository.increment(
      { id: UuidHelper.toBinary(id) },
      'balance',
      amount,
    );
  }
}

@Controller('cash-accounts')
export class CashAccountController {
  constructor(private readonly cashAccountService: CashAccountService) {}

  @Post()
  create(@Body() dto: CreateCashAccountDto) {
    return this.cashAccountService.create(dto);
  }

  @Get()
  findAll() {
    return this.cashAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashAccountService.findOne(id);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([CashAccount])],
  controllers: [CashAccountController],
  providers: [CashAccountService],
  exports: [CashAccountService],
})
export class CashAccountModule {}
