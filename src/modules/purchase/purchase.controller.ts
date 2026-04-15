import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { PurchaseService, CreatePurchaseDto } from './purchase.service';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  create(@Body() dto: CreatePurchaseDto) {
    return this.purchaseService.create(dto);
  }

  @Get()
  findAll() {
    return this.purchaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Put(':id/receive')
  receive(@Param('id') id: string) {
    return this.purchaseService.receive(id);
  }

  @Put(':id/post')
  post(@Param('id') id: string) {
    return this.purchaseService.post(id);
  }
}
