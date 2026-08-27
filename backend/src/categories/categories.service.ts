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

import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities/category.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Crea y guarda la categoria en una sola operacion.
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // Lista paginada (take/skip = limit/offset).
  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.categoryRepository.find({
      take: limit,
      skip: offset,
    });
  }

  // Busca por id (uuid) o por nombre, segun lo que llegue en 'term'.
  async findOne(term: string) {
    let category: Category | null;

    if (isUUID(term)) {
      category = await this.categoryRepository.findOneBy({ id: term });
    } else {
      category = await this.categoryRepository.findOneBy({
        name: term.toLowerCase(),
      });
    }

    if (!category)
      throw new NotFoundException(`Category with ${term} not found`);

    return category;
  }

  // preload junta el id con los campos nuevos sobre el registro existente.
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category)
      throw new NotFoundException(`Category with id: ${id} not found`);

    try {
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  // Reutiliza findOne() para asegurarse de que exista antes de borrar.
  async remove(id: string) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { message: `Category with id: ${id} removed` };
  }

  // Patron visto en clase: centraliza el manejo de errores de base de datos
  // para no repetir el mismo try/catch en cada metodo.
  private handleDBExceptions(error: unknown): never {
    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as {
        errno?: number;
        sqlMessage?: string;
      };

      // 1062: codigo de MariaDB para "entrada duplicada" (name repetido).
      if (driverError.errno === 1062) {
        throw new BadRequestException(driverError.sqlMessage);
      }
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  // Usado solo por el seed, para vaciar la tabla antes de volver a poblarla.
  async deleteAllCategories() {
    const query = this.categoryRepository.createQueryBuilder('category');

    try {
      return await query.delete().execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }
}
