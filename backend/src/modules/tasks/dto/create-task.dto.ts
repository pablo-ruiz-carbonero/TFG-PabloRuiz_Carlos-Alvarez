// DTOs de tareas agrícolas. La normalización del campo 'tipo' tolera variaciones de mayúsculas
// y tildes que pueden llegar del frontend móvil o de integraciones externas.
import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

// Normaliza a minúsculas sin tildes para aceptar tanto "Riego" como "riego" o "Fertilización"
const normalizeTipo = (value: string): string =>
  value?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') ?? value;

export class CreateTaskDto {
  @IsNumber()
  cultivo_id: number;

  @Transform(({ value }) => normalizeTipo(value))
  @IsEnum(['siembra', 'riego', 'fertilizacion', 'cosecha', 'plaguicida'])
  tipo: string;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  hora?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  cantidad?: number;

  @IsOptional()
  @IsString()
  unidad?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @Transform(({ value }) => normalizeTipo(value))
  @IsEnum(['siembra', 'riego', 'fertilizacion', 'cosecha', 'plaguicida'])
  tipo?: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  hora?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  cantidad?: number;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsEnum(['pendiente', 'completada'])
  status?: string;
}