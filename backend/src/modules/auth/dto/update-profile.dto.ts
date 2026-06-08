// DTO de actualización de perfil. Acepta los campos tanto en español (app web) como en inglés
// (app móvil); el servicio resuelve cuál usar con el operador de coalescencia nula.
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  // Aliases en inglés para el web (PATCH /auth/profile con { name, phone })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;
}
