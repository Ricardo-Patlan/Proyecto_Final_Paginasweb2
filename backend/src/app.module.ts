import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { LoansModule } from './loans/loans.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    // Habilita la lectura de variables de entorno (.env) en todo el proyecto.
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      // Detecta automaticamente las entidades registradas en cada modulo
      // (via TypeOrmModule.forFeature([...])), sin listarlas todas aqui a mano.
      autoLoadEntities: true,
      // Crea/ajusta las tablas segun las entidades. Comodo en desarrollo,
      // en un proyecto real se reemplazaria por migraciones controladas.
      synchronize: true,
    }),
    CommonModule,
    AuthModule,
    CategoriesModule,
    BooksModule,
    LoansModule,
    SeedModule,
  ],
})
export class AppModule {}
