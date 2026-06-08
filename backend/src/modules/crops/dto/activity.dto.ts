// Vocabulario bidireccional entre el modelo del frontend (inglés) y el del backend (español).
// Centralizar los mapas aquí evita que controller y service diverjan en los nombres de tipo.
import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

// Frontend → backend: cuatro actividades se traducen a tipos de tarea reconocidos por el backend.
export const ACTIVITY_TO_TAREA: Record<string, string> = {
  irrigation: 'riego',
  fertilization: 'fertilizacion',
  harvest: 'cosecha',
  pest: 'plaguicida',
};

// Backend → frontend: 'siembra' no tiene actividad equivalente en el modelo web,
// se mapea a 'pest' como fallback para no perder el registro en la vista del agricultor.
export const TAREA_TO_ACTIVITY: Record<string, string> = {
  riego: 'irrigation',
  fertilizacion: 'fertilization',
  cosecha: 'harvest',
  plaguicida: 'pest',
  siembra: 'pest',
};

export class CreateActivityDto {
  @IsEnum(['irrigation', 'fertilization', 'harvest', 'pest'])
  type: string;

  @IsDateString()
  date: string;

  @IsString()
  details: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;
}

export function taskToActivity(task: any, cropId?: string) {
  return {
    id: task.id.toString(),
    cropId: (task.cultivo?.id ?? task.cultivo_id ?? cropId ?? '').toString(),
    type: TAREA_TO_ACTIVITY[task.tipo] ?? 'pest',
    date: task.fecha,
    details: task.descripcion ?? '',
    quantity: task.cantidad ?? undefined,
    unit: task.unidad ?? undefined,
  };
}
