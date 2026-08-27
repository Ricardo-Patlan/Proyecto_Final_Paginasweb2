import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { RequestWithUser } from '../interfaces';

// Un Guard implementa CanActivate: Nest lo ejecuta ANTES del controlador y usa
// el resultado para decidir si la peticion continua o se rechaza.
@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lee, bajo META_ROLES, el arreglo de roles que @RoleProtected(...) dejo
    // guardado en el metodo del controlador actual.
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    // Sin @RoleProtected(...), o con un arreglo vacio, no hay restriccion de
    // rol que aplicar (la autenticacion ya la valido AuthGuard()).
    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    throw new ForbiddenException(
      `User ${user.fullName} needs a valid role: [${validRoles.join(', ')}]`,
    );
  }
}
