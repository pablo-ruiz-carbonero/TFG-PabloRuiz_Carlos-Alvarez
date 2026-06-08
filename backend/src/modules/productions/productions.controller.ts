// Controlador de registros de producción (cosechas). Todas las rutas requieren JWT.
// La ruta estática /crop/:cropId debe declararse antes de /:id para evitar conflictos.
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductionsService } from './productions.service';
import { CreateProductionDto, UpdateProductionDto } from './dto/production.dto';

@Controller('productions')
@UseGuards(AuthGuard('jwt'))
export class ProductionsController {
  constructor(private readonly productionsService: ProductionsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.productionsService.findAll(req.user.id);
  }

  @Get('crop/:cropId')
  findByCrop(@Param('cropId') cropId: string, @Request() req: any) {
    return this.productionsService.findByCrop(+cropId, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateProductionDto, @Request() req: any) {
    return this.productionsService.create(dto, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductionDto, @Request() req: any) {
    return this.productionsService.update(+id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.productionsService.remove(+id, req.user.id);
  }
}
