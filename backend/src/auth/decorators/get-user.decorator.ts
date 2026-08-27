import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequestWithUser } from '../interfaces';

type UserDataKey = 'id' | 'email' | 'fullName' | 'isActive' | 'roles';

// Decorador de parametro personalizado: permite usar @GetUser() o
// @GetUser('email') como argumento de un metodo de controlador, igual que
// @Body() o @Param(). Solo funciona en rutas protegidas por AuthGuard(), que
// es quien deja el usuario en req.user (via JwtStrategy.validate()).
export const GetUser = createParamDecorator(
  (data: UserDataKey | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    // Si no hay usuario en la peticion, es un error de configuracion (se uso
    // @GetUser() en una ruta que no paso por AuthGuard()), no una peticion
    // invalida del cliente.
    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    return !data ? user : user[data];
  },
);
