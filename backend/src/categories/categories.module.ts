import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([Category]),
    // Para poder usar @Auth()/@GetUser() en categories.controller.ts.
    AuthModule,
  ],
  // Se exportan para que BooksModule y SeedModule puedan reutilizar la
  // logica de categorias sin volver a registrar TypeOrmModule.forFeature.
  exports: [CategoriesService, TypeOrmModule],
})
export class CategoriesModule {}
