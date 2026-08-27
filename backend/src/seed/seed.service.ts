import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoriesService } from '../categories/categories.service';
import { BooksService } from '../books/books.service';
import { LoansService } from '../loans/loans.service';

@Injectable()
export class SeedService {
  constructor(
    // Se inserta directo con el repositorio (no via AuthService.create())
    // porque las contraseñas de seed-data.ts ya vienen hasheadas.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // Se reutilizan los services de cada modulo para crear categorias y
    // libros: asi se aprovecha la misma validacion/logica que usaria
    // cualquier request real, en vez de duplicarla aqui.
    private readonly categoriesService: CategoriesService,
    private readonly booksService: BooksService,
    private readonly loansService: LoansService,
  ) {}

  async runSeed() {
    await this.deleteTables();

    await this.insertUsers();
    const categories = await this.insertCategories();
    await this.insertBooks(categories);

    return 'SEED EXECUTED';
  }

  // Se borra en orden inverso a como se relacionan las tablas: los
  // prestamos dependen de libros y usuarios, y los libros dependen de
  // categorias, asi que se borran primero para no chocar con las llaves
  // foraneas.
  private async deleteTables() {
    await this.loansService.deleteAllLoans();
    await this.booksService.deleteAllBooks();
    await this.categoriesService.deleteAllCategories();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().execute();
  }

  private async insertUsers() {
    const users = initialData.users.map((user) =>
      this.userRepository.create(user),
    );
    return this.userRepository.save(users);
  }

  // Devuelve un mapa "nombre de categoria -> id ya guardado", para poder
  // asociar cada libro con su categoria en insertBooks().
  private async insertCategories() {
    const categoryMap = new Map<string, Category>();

    for (const seedCategory of initialData.categories) {
      const category = await this.categoriesService.create(seedCategory);
      if (category) categoryMap.set(category.name, category);
    }

    return categoryMap;
  }

  private async insertBooks(categories: Map<string, Category>) {
    const insertPromises = initialData.books.map((seedBook) => {
      const { categoryName, ...bookData } = seedBook;
      const category = categories.get(categoryName);

      return this.booksService.create({
        ...bookData,
        categoryId: category?.id,
      });
    });

    await Promise.all(insertPromises);
    return true;
  }
}
