import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        // Nunca se guarda la contraseña en texto plano: bcrypt genera un
        // hash irreversible. El '10' es el costo (salt rounds).
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);

      const { password: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // password tiene { select: false } en la entidad, asi que hay que
    // pedirla explicitamente para poder compararla.
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // Recibe un usuario YA autenticado (via @Auth() en el controller) y solo
  // le entrega un token nuevo, para poder "renovar" la sesion sin volver a
  // pedir la contraseña.
  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  // Centraliza el manejo de errores de base de datos (patron visto en clase),
  // para no repetir el mismo try/catch en cada metodo.
  private handleDBExceptions(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as {
        errno?: number;
        sqlMessage?: string;
      };

      // 1062: codigo de MariaDB para "entrada duplicada" (email repetido).
      if (driverError.errno === 1062) {
        throw new BadRequestException(driverError.sqlMessage);
      }
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
