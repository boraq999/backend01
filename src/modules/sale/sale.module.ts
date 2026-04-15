import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { SaleService, CreateSaleDto } from './sale.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale, SaleItem } from './sale.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomerModule } from '../customer/customer.module';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  create(@Body() dto: CreateSaleDto) {
    return this.saleService.create(dto);
  }

  @Get()
  findAll() {
    return this.saleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleService.findOne(id);
  }

  @Put(':id/close')
  close(@Param('id') id: string) {
    return this.saleService.close(id);
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem]),
    InventoryModule,
    CustomerModule,
  ],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
