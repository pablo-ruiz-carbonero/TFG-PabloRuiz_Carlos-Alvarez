// Módulo de registros de producción (cosechas). Permite al agricultor anotar
// la cantidad cosechada de cada cultivo en una fecha concreta.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Production } from '../../database/entities/production.entity';
import { ProductionsController } from './productions.controller';
import { ProductionsService } from './productions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Production])],
  controllers: [ProductionsController],
  providers: [ProductionsService],
})
export class ProductionsModule {}
