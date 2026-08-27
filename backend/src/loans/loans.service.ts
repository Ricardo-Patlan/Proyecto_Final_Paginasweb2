import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { CreateLoanDto } from './dto';
import { Loan } from './entities/loan.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../auth/entities/user.entity';
import { BooksService } from '../books/books.service';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class LoansService {
  private readonly logger = new Logger('LoansService');

  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,

    // Se necesita aparte del BooksService para poder guardar el cambio de
    // stock (BooksService no expone un metodo para eso, no le corresponde).
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    private readonly booksService: BooksService,
  ) {}

  // Crea el prestamo y descuenta una copia del stock del libro.
  async create(createLoanDto: CreateLoanDto, user: User) {
    // findOne() ya lanza 404 si el libro no existe; se hace fuera del
    // try/catch para no confundirlo con un error de base de datos.
    const book = await this.booksService.findOne(createLoanDto.bookId);

    if (book.stock < 1) {
      throw new BadRequestException(`No hay copias disponibles de "${book.title}"`);
    }

    try {
      book.stock -= 1;
      await this.bookRepository.save(book);

      const loan = this.loanRepository.create({ book, user });
      await this.loanRepository.save(loan);
      return loan;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // Solo para admin: todos los prestamos, paginados.
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.loanRepository.find({
      take: limit,
      skip: offset,
      order: { loanDate: 'DESC' },
    });
  }

  // Solo los prestamos del usuario autenticado.
  findMine(user: User, paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.loanRepository.find({
      where: { user: { id: user.id } },
      take: limit,
      skip: offset,
      order: { loanDate: 'DESC' },
    });
  }

  // Marca el prestamo como devuelto y regresa la copia al stock del libro.
  async markAsReturned(id: string) {
    const loan = await this.loanRepository.findOneBy({ id });
    if (!loan) throw new NotFoundException(`Loan with id: ${id} not found`);

    if (loan.status === 'returned') {
      throw new BadRequestException('This loan was already returned');
    }

    try {
      loan.status = 'returned';
      loan.returnDate = new Date();
      await this.loanRepository.save(loan);

      loan.book.stock += 1;
      await this.bookRepository.save(loan.book);

      return loan;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: unknown): never {
    if (error instanceof QueryFailedError) {
      this.logger.error(error);
      throw new BadRequestException('Unexpected database error');
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  // Usado solo por el seed.
  async deleteAllLoans() {
    const query = this.loanRepository.createQueryBuilder('loan');

    try {
      return await query.delete().execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
