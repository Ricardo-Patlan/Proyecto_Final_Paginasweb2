import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Solo admin puede registrar libros nuevos.
  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  // Ruta publica: cualquiera puede ver el catalogo.
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.booksService.findAll(paginationDto);
  }

  // Ruta publica: acepta id (uuid) o titulo.
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.booksService.findOne(term);
  }

  // Solo admin puede editar.
  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  // Solo admin puede borrar.
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.remove(id);
  }
}
