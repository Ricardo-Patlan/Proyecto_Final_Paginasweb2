import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from '../interfaces';

// Decorador propio que combina, en uno solo, los dos decoradores que
// normalmente habria que escribir por separado en cada ruta protegida:
// @RoleProtected(...) + @UseGuards(AuthGuard(), UserRoleGuard).
//
// ...roles: rest parameter, permite usar @Auth() sin argumentos (solo exige
// estar autenticado) o con uno o varios roles, ej. @Auth(ValidRoles.admin).
export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    // 1) Guarda los roles permitidos como metadata en la ruta.
    RoleProtected(...roles),
    // 2) Guards que corren antes del controlador: AuthGuard() verifica el
    //    token JWT; UserRoleGuard revisa despues que el rol del usuario este
    //    entre los permitidos por RoleProtected.
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
