// Controlador de cultivos. Expone el CRUD de cultivos y parcelas, y un alias de actividades
// que mapea el vocabulario del frontend web al modelo de tareas del backend.
import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CropsService } from './crops.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateCropDto, UpdateCropDto } from './dto/create-crop.dto';
import { CreateActivityDto, ACTIVITY_TO_TAREA, taskToActivity } from './dto/activity.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

// Todas las rutas requieren JWT; las de escritura además requieren el rol "agricultor"
@Controller('crops')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CropsController {
  constructor(
    private readonly cropsService: CropsService,
    private readonly tasksService: TasksService, // para crear/eliminar actividades como tareas
  ) {}

  @Post()
  @Roles('agricultor')
  create(@Body() createCropDto: CreateCropDto, @Request() req: any) {
    return this.cropsService.create(createCropDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.cropsService.findAll(req.user.id);
  }

  // Ruta de compatibilidad; ignora el farmerId del path y usa el del token para mayor seguridad
  @Get('farmer/:farmerId')
  findByFarmer(@Request() req: any) {
    return this.cropsService.findAll(req.user.id);
  }

  @Get('parcels/list')
  getParcels(@Request() req: any) {
    return this.cropsService.getParcels(req.user.id);
  }

  @Post('parcels/create')
  @Roles('agricultor')
  createParcel(
    @Body() body: { nombre: string; ubicacion?: string; tamano?: number },
    @Request() req: any,
  ) {
    return this.cropsService.createParcel(req.user.id, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.cropsService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @Roles('agricultor')
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto, @Request() req: any) {
    return this.cropsService.update(+id, updateCropDto, req.user.id);
  }

  @Delete(':id')
  @Roles('agricultor')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.cropsService.remove(+id, req.user.id);
  }

  // ── Activities (alias web de las tareas) ──────────────────────────────────

  // El frontend web usa el concepto "activity"; aquí se traduce al modelo interno de tareas
  @Post(':cropId/activities')
  @Roles('agricultor')
  async createActivity(
    @Param('cropId') cropId: string,
    @Body() dto: CreateActivityDto,
    @Request() req: any,
  ) {
    // ACTIVITY_TO_TAREA mapea los tipos de actividad del frontend a los tipos de tarea del backend
    const taskDto = {
      cultivo_id: +cropId,
      tipo: ACTIVITY_TO_TAREA[dto.type] ?? 'siembra', // valor por defecto si el tipo no está mapeado
      fecha: dto.date,
      descripcion: dto.details,
      cantidad: dto.quantity,
      unidad: dto.unit,
    };
    const task = await this.tasksService.create(taskDto as any, req.user.id);
    // Convierte la tarea guardada de vuelta al formato de actividad que espera el frontend
    return taskToActivity(task, cropId);
  }

  @Delete(':cropId/activities/:activityId')
  @Roles('agricultor')
  deleteActivity(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    return this.tasksService.remove(+activityId, req.user.id);
  }
}
