// Módulo de cultivos. Gestiona el CRUD de cultivos y parcelas del agricultor.
// Importa TasksModule para que el controlador pueda crear tareas (actividades) asociadas a cultivos.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropsService } from './crops.service';
import { CropsController } from './crops.controller';
import { Crop } from '../../database/entities/crop.entity';
import { Parcela } from '../../database/entities/parcela.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crop, Parcela]),
    TasksModule, // necesario para inyectar TasksService en CropsController
  ],
  controllers: [CropsController],
  providers: [CropsService],
  exports: [CropsService], // exportado por si otros módulos necesitan consultar cultivos
})
export class CropsModule {}