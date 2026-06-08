// DTOs de producción (cosechas). El diseño es minimalista a propósito: cantidad y fecha
// son los únicos datos que el agricultor necesita registrar para el historial de rendimiento.
import { IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateProductionDto {
  @IsNumber()
  cultivo_id: number;

  @IsNumber()
  cantidad: number;

  @IsDateString()
  fecha: string;
}

export class UpdateProductionDto {
  @IsNumber()
  @IsOptional()
  cantidad?: number;

  @IsDateString()
  @IsOptional()
  fecha?: string;
}
