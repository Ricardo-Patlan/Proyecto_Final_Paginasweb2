import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';

// Clave bajo la cual se guarda la metadata de roles en cada ruta.
export const META_ROLES = 'roles';

// No valida nada por si solo: solo ADJUNTA los roles permitidos al metodo del
// controlador (via SetMetadata). Quien realmente los valida es UserRoleGuard,
// leyendolos despues con Reflector.
export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
