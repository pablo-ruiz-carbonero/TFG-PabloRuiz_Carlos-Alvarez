// DTOs del marketplace. Las constantes CATEGORIAS y UNIDADES son la fuente de verdad compartida
// entre Create y Update para que las listas de valores permitidos nunca diverjan.
import { IsString, IsNumber, IsOptional, IsEnum, IsArray, Min } from 'class-validator';

const CATEGORIAS = ['Semillas', 'Fertilizantes', 'Maquinaria', 'Fitosanitarios', 'Otros'];
const UNIDADES = ['€/kg', '€/u', '€/L', '€/ha', '€/saco'];

export class CreateProductDto {
  @IsString()
  nombre: string;

  @IsEnum(CATEGORIAS)
  categoria: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsEnum(UNIDADES)
  unidad: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  provincia?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsEnum(CATEGORIAS)
  @IsOptional()
  categoria?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  precio?: number;

  @IsEnum(UNIDADES)
  @IsOptional()
  unidad?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  provincia?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagenes?: string[];
}
