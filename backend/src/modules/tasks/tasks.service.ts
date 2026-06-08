// Servicio de tareas. Aplica aislamiento por usuario en todas las operaciones
// verificando que el cultivo relacionado pertenezca al usuario autenticado.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../database/entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Devuelve las tareas de un cultivo ordenadas de más nueva a más antigua
  async findAllByCrop(cropId: number, userId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: {
        cultivo: {
          id: cropId,
          usuario: { id: userId } // garantiza que el cultivo sea del usuario autenticado
        }
      },
      relations: ['cultivo'],
      order: { fechaCreacion: 'DESC' }
    });
  }

  // Busca una tarea y verifica que el cultivo al que pertenece sea del usuario autenticado
  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        cultivo: { usuario: { id: userId } }
      },
      relations: ['cultivo'],
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    // Se verifica la propiedad del cultivo antes de crear la tarea para evitar tareas huérfanas
    // Se usa taskRepository.manager para acceder a otra entidad sin importarla directamente
    const crop = await this.taskRepository.manager.findOne('Crop', {
      where: {
        id: createTaskDto.cultivo_id,
        usuario: { id: userId }
      }
    });

    if (!crop) {
      throw new NotFoundException('Cultivo no encontrado o no autorizado');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      cultivo: { id: createTaskDto.cultivo_id } as any, // referencia parcial para resolver FK
    });

    return this.taskRepository.save(task);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
    // findOne ya verifica la propiedad del cultivo, por lo que no hace falta comprobación adicional
    const task = await this.findOne(id, userId);
    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.taskRepository.remove(task);
  }

  // Devuelve el número de tareas pendientes de un cultivo; usado en el dashboard del agricultor
  async getPendingCount(cropId: number, userId: number): Promise<number> {
    return this.taskRepository.count({
      where: {
        cultivo: {
          id: cropId,
          usuario: { id: userId }
        },
        status: 'pendiente'
      }
    });
  }
}