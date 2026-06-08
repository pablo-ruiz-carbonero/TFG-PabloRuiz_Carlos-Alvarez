// DTOs de cultivo. CreateCropDto recoge los datos iniciales de siembra; UpdateCropDto amplía
// esos campos con fechas de seguimiento (último riego/fertilización) que se actualizan a lo largo del ciclo.
import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, IsIn } from 'class-validator';

export class CreateCropDto {
  @IsString()
  nombre: string;

  @IsString()
  variedad: string;

  @IsString()
  tipo_cultivo: string;

  @IsOptional()
  @IsNumber()
  parcela_id?: number;

  @IsNumber()
  superficie: number;

  @IsDateString()
  fecha_siembra: string;

  @IsOptional()
  @IsString()
  fase_actual?: string;

  @IsOptional()
  @IsDateString()
  fecha_cosecha_esperada?: string;

  @IsOptional()
  @IsNumber()
  produccion_esperada?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsNumber()
  dias_riego?: number;

  @IsOptional()
  @IsNumber()
  dias_fertilizacion?: number;
}

export class UpdateCropDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  variedad?: string;

  @IsOptional()
  @IsString()
  tipo_cultivo?: string;

  @IsOptional()
  @IsNumber()
  parcela_id?: number;

  @IsOptional()
  @IsNumber()
  superficie?: number;

  @IsOptional()
  @IsDateString()
  fecha_siembra?: string;

  @IsOptional()
  @IsString()
  fase_actual?: string;

  @IsOptional()
  @IsDateString()
  fecha_cosecha_esperada?: string;

  @IsOptional()
  @IsNumber()
  produccion_esperada?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsDateString()
  ultimo_riego?: string;

  @IsOptional()
  @IsDateString()
  ultima_fertilizacion?: string;

  @IsOptional()
  @IsNumber()
  dias_riego?: number;

  @IsOptional()
  @IsNumber()
  dias_fertilizacion?: number;

  @IsOptional()
  @IsIn(['active', 'completed', 'archived'])
  status?: string;
}