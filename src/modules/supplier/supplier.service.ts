import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { UuidHelper } from '../../common/uuid.helper';

export class CreateSupplierDto {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export class UpdateSupplierDto {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async create(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.supplierRepository.create(dto);
    return await this.supplierRepository.save(supplier);
  }

  async findAll(): Promise<Supplier[]> {
    return await this.supplierRepository.find();
  }

  async findOne(id: string): Promise<Supplier | null> {
    return await this.supplierRepository.findOne({
      where: { id: UuidHelper.toBinary(id) },
    });
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier | null> {
    await this.supplierRepository.update({ id: UuidHelper.toBinary(id) }, dto);
    return this.findOne(id);
  }

  async updateBalance(id: string, amount: number): Promise<void> {
    await this.supplierRepository.increment(
      { id: UuidHelper.toBinary(id) },
      'balance',
      amount,
    );
  }
}
