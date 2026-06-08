// Decorador personalizado que anota rutas o controladores con los roles permitidos.
// RolesGuard lo lee en tiempo de ejecución para decidir si se permite el acceso.
import { SetMetadata } from '@nestjs/common';

// Clave bajo la que se almacena el metadato de roles en el reflector de NestJS
export const ROLES_KEY = 'roles';

// Uso: @Roles('agricultor', 'administrador') sobre un método o clase
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
