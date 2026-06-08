// Guard de autorización basado en roles. Debe usarse junto a AuthGuard('jwt') para que
// req.user ya esté disponible cuando este guard se ejecuta.
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // getAllAndOverride da prioridad al decorador del método sobre el de la clase
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene @Roles, se permite el acceso a cualquier usuario autenticado
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    // Los administradores tienen acceso total a cualquier recurso protegido por roles
    if (user?.rol === 'administrador') return true;

    // user.rol viene del payload JWT; comprueba si el usuario tiene al menos uno de los roles requeridos
    return requiredRoles.some((r) => r === user?.rol);
  }
}
