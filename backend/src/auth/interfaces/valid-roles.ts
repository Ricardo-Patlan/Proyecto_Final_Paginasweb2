// Roles validos dentro de la aplicacion. Se escribe "= 'valor'" para que el
// valor del enum sea el mismo string que la clave: asi se puede comparar
// directo contra user.roles (que se guarda como string[] en la base de datos)
// sin depender del orden en que se declararon los roles.
export enum ValidRoles {
  admin = 'admin',
  user = 'user',
}
