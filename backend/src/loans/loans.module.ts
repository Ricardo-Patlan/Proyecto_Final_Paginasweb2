import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { Book } from '../books/entities/book.entity';
import { AuthModule } from '../auth/auth.module';
import { BooksModule } from '../books/books.module';

@Module({
  controllers: [LoansController],
  providers: [LoansService],
  imports: [
    // Se registra Book aqui tambien porque LoansService necesita su propio
    // Repository<Book> para actualizar el stock.
    TypeOrmModule.forFeature([Loan, Book]),
    AuthModule,
    // Para poder inyectar BooksService (buscar el libro antes de prestarlo).
    BooksModule,
  ],
  exports: [LoansService, TypeOrmModule],
})
export class LoansModule {}
