import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AddPriceDto } from './dto/add-price-dto';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post()
  async registerProduct(@Body() productData: CreateProductDto) {
    return this.productService.registerProduct(productData);
  }

  @Post('new-prices/:barcode')
  async addPrice(@Param('barcode') barcode: string, @Body() body: AddPriceDto) {
    return this.productService.addPrice(barcode, body);
  }

  @Get('')
  async findAll() {
    return this.productService.findAll();
  }

  @Get('search')
  async search(@Query('term') term: string, @Query('storeId') storeId: string) {
    return this.productService.searchByName(term, storeId);
  }

  @Get('barcode/:barcode')
  async findByBarcode(@Param('barcode') barcode: string) {
    return this.productService.findByBarcode(barcode);
  }
}
