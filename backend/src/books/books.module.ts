import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [
    TypeOrmModule.forFeature([Book]),
    AuthModule,
    // Para poder inyectar CategoriesService en BooksService y resolver el
    // categoryId que llega en los DTOs.
    CategoriesModule,
  ],
  exports: [BooksService, TypeOrmModule],
})
export class BooksModule {}
