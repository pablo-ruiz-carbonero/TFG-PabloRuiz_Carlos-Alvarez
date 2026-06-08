// DTO de inicio de sesión. Valida que el email tenga formato correcto y que la contraseña sea un string.
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}