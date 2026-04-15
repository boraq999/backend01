import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UuidHelper } from '../../common/uuid.helper';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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

export class CreateExpenseDto {
  description: string;
  amount: number;
  category?: string;
  notes?: string;
  expenseDate?: Date;
}

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create(dto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...dto,
      expenseDate: dto.expenseDate || new Date(),
    });
    return await this.expenseRepository.save(expense);
  }

  async findAll(): Promise<Expense[]> {
    return await this.expenseRepository.find({
      order: { expenseDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Expense | null> {
    return await this.expenseRepository.findOne({
      where: { id: UuidHelper.toBinary(id) },
    });
  }

  async getTotalByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.expense_date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return parseFloat(result?.total || '0');
  }
}

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() dto: CreateExpenseDto) {
    return this.expenseService.create(dto);
  }

  @Get()
  findAll() {
    return this.expenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
