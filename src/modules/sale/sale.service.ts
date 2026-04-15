import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale, SaleItem } from './sale.entity';
import { SaleStatus, InventoryEventType } from '../../shared/enums';
import { UuidHelper } from '../../common/uuid.helper';
import { InventoryService } from '../inventory/inventory.service';
import { CustomerService } from '../customer/customer.module';

export class CreateSaleDto {
  customerId?: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  paidAmount?: number;
  notes?: string;
}

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
    private inventoryService: InventoryService,
    private customerService: CustomerService,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateSaleDto): Promise<Sale | null> {
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const paidAmount = dto.paidAmount || 0;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = this.saleRepository.create({
        customerId: dto.customerId ? UuidHelper.toBinary(dto.customerId) : undefined,
        totalAmount,
        paidAmount,
        notes: dto.notes,
        status: paidAmount >= totalAmount ? SaleStatus.PAID : SaleStatus.DRAFT,
      });

      const savedSale = await queryRunner.manager.save(Sale, sale);

      const items = dto.items.map((item) =>
        this.saleItemRepository.create({
          saleId: savedSale.id,
          productId: UuidHelper.toBinary(item.productId),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        }),
      );

      await queryRunner.manager.save(SaleItem, items);

      // Deduct from inventory
      for (const item of dto.items) {
        await this.inventoryService.recordEvent(
          InventoryEventType.SALE_DEDUCT,
          item.productId,
          -item.quantity,
          savedSale.getIdAsString(),
          'SALE',
          `Sale #${savedSale.getIdAsString()}`,
        );
      }

      // Update customer balance if credit sale
      if (dto.customerId && paidAmount < totalAmount) {
        await this.customerService.updateBalance(
          dto.customerId,
          totalAmount - paidAmount,
        );
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedSale.getIdAsString());
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleRepository.find({
      relations: ['customer', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Sale | null> {
    return await this.saleRepository.findOne({
      where: { id: UuidHelper.toBinary(id) },
      relations: ['customer', 'items'],
    });
  }

  async close(id: string): Promise<Sale | null> {
    await this.saleRepository.update(
      { id: UuidHelper.toBinary(id) },
      { status: SaleStatus.CLOSED },
    );
    return this.findOne(id);
  }
}
