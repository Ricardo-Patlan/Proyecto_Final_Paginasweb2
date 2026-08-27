import { Request } from 'express';
import { User } from '../entities/user.entity';

// Extiende el Request de Express declarando que req.user, cuando existe, es
// de tipo User. JwtStrategy.validate() es quien realmente coloca ese valor
// ahi en tiempo de ejecucion (Passport lo hace por debajo); esta interfaz
// solo le describe esa forma a TypeScript.
export interface RequestWithUser extends Request {
  user: User;
}
