import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEvent } from './inventory-event.entity';
import { InventoryEventType } from '../../shared/enums';
import { UuidHelper } from '../../common/uuid.helper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InventoryService {
  private branchId: Buffer;

  constructor(
    @InjectRepository(InventoryEvent)
    private inventoryRepository: Repository<InventoryEvent>,
    private configService: ConfigService,
  ) {
    const branchIdStr = this.configService.get('BRANCH_ID') || 'branch-001';
    this.branchId = UuidHelper.toBinary(branchIdStr);
  }

  async recordEvent(
    eventType: InventoryEventType,
    productId: string,
    quantity: number,
    referenceId?: string,
    referenceType?: string,
    notes?: string,
  ): Promise<InventoryEvent> {
    const event = this.inventoryRepository.create({
      branchId: this.branchId,
      eventType,
      productId: UuidHelper.toBinary(productId),
      quantity,
      referenceId: referenceId ? UuidHelper.toBinary(referenceId) : undefined,
      referenceType,
      notes,
    });

    return await this.inventoryRepository.save(event);
  }

  async getProductStock(productId: string): Promise<number> {
    const result = await this.inventoryRepository
      .createQueryBuilder('event')
      .select('SUM(event.quantity)', 'total')
      .where('event.product_id = :productId', {
        productId: UuidHelper.toBinary(productId),
      })
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  async getAllStock(): Promise<Array<{ productId: string; stock: number }>> {
    const results = await this.inventoryRepository
      .createQueryBuilder('event')
      .select('event.product_id', 'productId')
      .addSelect('SUM(event.quantity)', 'stock')
      .groupBy('event.product_id')
      .getRawMany();

    return results.map((r) => ({
      productId: UuidHelper.fromBinary(r.productId),
      stock: parseFloat(r.stock),
    }));
  }

  async getProductHistory(productId: string): Promise<InventoryEvent[]> {
    return await this.inventoryRepository.find({
      where: { productId: UuidHelper.toBinary(productId) },
      order: { createdAt: 'DESC' },
      relations: ['product'],
    });
  }
}
