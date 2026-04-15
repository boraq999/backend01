import { Injectable, Controller, Get, Query } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { SaleModule } from '../sale/sale.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { ExpenseModule } from '../expense/expense.module';
import { InventoryModule } from '../inventory/inventory.module';

@Injectable()
export class ReportsService {
  async getDashboardSummary() {
    return {
      message: 'Dashboard summary - to be implemented',
    };
  }

  async getSalesReport(startDate: Date, endDate: Date) {
    return {
      message: 'Sales report - to be implemented',
      startDate,
      endDate,
    };
  }
}

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.reportsService.getDashboardSummary();
  }

  @Get('sales')
  getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getSalesReport(
      new Date(startDate),
      new Date(endDate),
    );
  }
}

@Module({
  imports: [SaleModule, PurchaseModule, ExpenseModule, InventoryModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
