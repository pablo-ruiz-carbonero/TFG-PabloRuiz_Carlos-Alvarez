// Módulo de tareas agrícolas. Exporta TasksService para que CropsModule pueda
// crear y eliminar tareas a través de las rutas de actividades.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from '../../database/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService], // requerido por CropsModule
})
export class TasksModule {}