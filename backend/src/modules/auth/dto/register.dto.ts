// DTO de registro de usuario. Valida los campos requeridos y los opcionales antes de llegar al servicio.
import { IsEmail, IsString, IsOptional, IsEnum, MinLength, MaxLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nombre?: string;

  @IsEmail()
  email: string;

  // Mínimo 6 caracteres para garantizar una contraseña básica
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  // Si no se especifica, el servicio asigna "agricultor" por defecto
  @IsEnum(["agricultor", "distribuidor", "proveedor", "administrador"])
  @IsOptional()
  rol?: string;
}
