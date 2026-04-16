import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { InventoryService } from '../inventory/inventory.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    const stockData = await this.inventoryService.getAllStock();
    
    return products.map(product => {
      const productId = product.getIdAsString();
      const stock = stockData.find(s => s.productId === productId)?.stock || 0;
      
      return {
        ...product,
        id: productId,
        salePrice: parseFloat(product.salePrice.toString()),
        purchasePrice: parseFloat(product.purchasePrice.toString()),
        stock: stock
      };
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    if (!product) return null;
    
    const stock = await this.inventoryService.getProductStock(id);
    
    return {
      ...product,
      id: product.getIdAsString(),
      salePrice: parseFloat(product.salePrice.toString()),
      purchasePrice: parseFloat(product.purchasePrice.toString()),
      stock: stock
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
