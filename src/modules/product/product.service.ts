import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { UuidHelper } from '../../common/uuid.helper';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id: UuidHelper.toBinary(id) },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { sku } });
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { barcode } });
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product | null> {
    await this.productRepository.update(
      { id: UuidHelper.toBinary(id) },
      dto,
    );
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete({ id: UuidHelper.toBinary(id) });
  }
}
