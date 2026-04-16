import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { UuidHelper } from '../../common/uuid.helper';
import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

export class CreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export class UpdateCustomerDto {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(dto);
    return await this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({
      where: { id: UuidHelper.toBinary(id) },
    });
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer | null> {
    await this.customerRepository.update({ id: UuidHelper.toBinary(id) }, dto);
    return this.findOne(id);
  }

  async updateBalance(id: string, amount: number): Promise<void> {
    await this.customerRepository.increment(
      { id: UuidHelper.toBinary(id) },
      'balance',
      amount,
    );
  }
}

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() dto: CreateCustomerDto) {
    return this.customerService.create(dto);
  }

  @Get()
  async findAll() {
    const customers = await this.customerService.findAll();
    return customers.map(customer => ({
      ...customer,
      id: customer.getIdAsString(),
      balance: parseFloat(customer.balance.toString())
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customerService.findOne(id);
    if (!customer) return null;
    
    return {
      ...customer,
      id: customer.getIdAsString(),
      balance: parseFloat(customer.balance.toString())
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
