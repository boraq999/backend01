import { Controller, Get, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock')
  getAllStock() {
    return this.inventoryService.getAllStock();
  }

  @Get('stock/:productId')
  getProductStock(@Param('productId') productId: string) {
    return this.inventoryService.getProductStock(productId);
  }

  @Get('history/:productId')
  getProductHistory(@Param('productId') productId: string) {
    return this.inventoryService.getProductHistory(productId);
  }
}
