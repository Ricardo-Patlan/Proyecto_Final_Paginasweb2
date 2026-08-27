import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateBookDto, UpdateBookDto } from './dto';
import { Book } from './entities/book.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger('BooksService');

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    // Se reutiliza CategoriesService.findOne() para resolver el categoryId
    // que llega en el DTO, en vez de inyectar Repository<Category> aparte.
    private readonly categoriesService: CategoriesService,
  ) {}

  // Si mandan categoryId, se busca esa categoria antes de crear el libro.
  // Se hace FUERA del try/catch: si no existe, findOne() ya lanza un 404
  // propio y no se quiere que termine disfrazado de error 500 de base de
  // datos (el catch de abajo es solo para errores del save()).
  async create(createBookDto: CreateBookDto) {
    const { categoryId, ...bookDetails } = createBookDto;
    const category = categoryId
      ? await this.categoriesService.findOne(categoryId)
      : null;

    try {
      const book = this.bookRepository.create({
        ...bookDetails,
        category,
      });
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // Lista paginada del catalogo.
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.bookRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let book: Book | null;

    if (isUUID(term)) {
      book = await this.bookRepository.findOneBy({ id: term });
    } else {
      // Si no es un uuid, se busca por titulo (sin importar mayusculas).
      const queryBuilder = this.bookRepository.createQueryBuilder('book');
      book = await queryBuilder
        .where('UPPER(book.title) = :title', { title: term.toUpperCase() })
        .getOne();
    }

    if (!book) throw new NotFoundException(`Book with ${term} not found`);

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const { categoryId, ...toUpdate } = updateBookDto;

    // preload() busca el libro y fusiona los campos simples (title, author,
    // stock...) sobre el existente. La categoria se resuelve aparte, porque
    // el DTO manda un id (categoryId) y no el objeto Category completo.
    const book = await this.bookRepository.preload({ id, ...toUpdate });
    if (!book) throw new NotFoundException(`Book with id: ${id} not found`);

    if (categoryId) {
      book.category = await this.categoriesService.findOne(categoryId);
    }

    try {
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // Reutiliza findOne() para confirmar que exista antes de borrar.
  async remove(id: string) {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
    return { message: `Book with id: ${id} removed` };
  }

  private handleDBExceptions(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as {
        errno?: number;
        sqlMessage?: string;
      };

      // 1062: codigo de MariaDB para "entrada duplicada" (isbn repetido).
      if (driverError.errno === 1062) {
        throw new BadRequestException(driverError.sqlMessage);
      }
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  // Usado solo por el seed.
  async deleteAllBooks() {
    const query = this.bookRepository.createQueryBuilder('book');

    try {
      return await query.delete().execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
