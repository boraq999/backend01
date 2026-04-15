import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase, PurchaseItem } from './purchase.entity';
import { PurchaseStatus, InventoryEventType } from '../../shared/enums';
import { UuidHelper } from '../../common/uuid.helper';
import { InventoryService } from '../inventory/inventory.service';
import { SupplierService } from '../supplier/supplier.service';

export class CreatePurchaseDto {
  supplierId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
}

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private purchaseItemRepository: Repository<PurchaseItem>,
    private inventoryService: InventoryService,
    private supplierService: SupplierService,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreatePurchaseDto): Promise<Purchase | null> {
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const purchase = this.purchaseRepository.create({
      supplierId: UuidHelper.toBinary(dto.supplierId),
      totalAmount,
      notes: dto.notes,
    });

    const savedPurchase = await this.purchaseRepository.save(purchase);

    const items = dto.items.map((item) =>
      this.purchaseItemRepository.create({
        purchaseId: savedPurchase.id,
        productId: UuidHelper.toBinary(item.productId),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
      }),
    );

    await this.purchaseItemRepository.save(items);

    return this.findOne(savedPurchase.getIdAsString());
  }

  async receive(id: string): Promise<Purchase | null> {
    const purchase = await this.findOne(id);
    
    if (!purchase || purchase.status !== PurchaseStatus.DRAFT) {
      throw new Error('Only draft purchases can be received');
    }

    await this.purchaseRepository.update(
      { id: UuidHelper.toBinary(id) },
      { status: PurchaseStatus.RECEIVED },
    );

    return this.findOne(id);
  }

  async post(id: string): Promise<Purchase | null> {
    const purchase = await this.findOne(id);

    if (!purchase || purchase.status !== PurchaseStatus.RECEIVED) {
      throw new Error('Only received purchases can be posted');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update purchase status
      await queryRunner.manager.update(
        Purchase,
        { id: UuidHelper.toBinary(id) },
        { status: PurchaseStatus.POSTED },
      );

      // Create inventory events
      for (const item of purchase.items) {
        await this.inventoryService.recordEvent(
          InventoryEventType.STOCK_IN,
          UuidHelper.fromBinary(item.productId),
          item.quantity,
          id,
          'PURCHASE',
          `Purchase #${id}`,
        );
      }

      // Update supplier balance
      await this.supplierService.updateBalance(
        UuidHelper.fromBinary(purchase.supplierId),
        purchase.totalAmount,
      );

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Purchase[]> {
    return await this.purchaseRepository.find({
      relations: ['supplier', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Purchase | null> {
    return await this.purchaseRepository.findOne({
      where: { id: UuidHelper.toBinary(id) },
      relations: ['supplier', 'items'],
    });
  }
}
