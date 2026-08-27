import { Module } from '@nestjs/common';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { BooksModule } from '../books/books.module';
import { LoansModule } from '../loans/loans.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    // Cada modulo se importa porque SeedService reutiliza su Service (o,
    // en el caso de AuthModule, su Repository<User> exportado).
    AuthModule,
    CategoriesModule,
    BooksModule,
    LoansModule,
  ],
})
export class SeedModule {}
