import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Crea la aplicacion de Nest a partir del modulo raiz, donde estan
  // declarados los demas modulos (Auth, Common, Categories, Books, Loans...).
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Todas las rutas quedan bajo el prefijo /api (ej. /api/books, /api/auth/login).
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      // Elimina del body cualquier propiedad que no este declarada en el DTO.
      whitelist: true,
      // En vez de solo eliminarla, si llega una propiedad extra responde 400.
      forbidNonWhitelisted: true,
      // Convierte los valores recibidos (ej. query params como string) al tipo
      // declarado en el DTO antes de validar, usando los decoradores de class-transformer.
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
