// Controlador del marketplace de productos. Todas las rutas requieren JWT.
// El orden de las rutas estáticas antes de las paramétricas es importante para NestJS.
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Debe declararse ANTES de /products/:id para que "mine" no se interprete como un ID numérico
  @Get('mine')
  findMine(@Request() req: any) {
    return this.productsService.findMine(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateProductDto, @Request() req: any) {
    return this.productsService.create(dto, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto, @Request() req: any) {
    return this.productsService.update(+id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.productsService.remove(+id, req.user.id);
  }
}
