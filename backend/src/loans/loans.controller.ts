import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';

import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  // Cualquier usuario logueado puede pedir prestado un libro para si mismo.
  @Post()
  @Auth()
  create(@Body() createLoanDto: CreateLoanDto, @GetUser() user: User) {
    return this.loansService.create(createLoanDto, user);
  }

  // Solo admin ve TODOS los prestamos.
  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.loansService.findAll(paginationDto);
  }

  // Cualquier usuario logueado ve solo sus propios prestamos.
  @Get('mine')
  @Auth()
  findMine(@GetUser() user: User, @Query() paginationDto: PaginationDto) {
    return this.loansService.findMine(user, paginationDto);
  }

  // Solo admin puede cerrar un prestamo (marcarlo como devuelto).
  @Patch(':id/return')
  @Auth(ValidRoles.admin)
  markAsReturned(@Param('id', ParseUUIDPipe) id: string) {
    return this.loansService.markAsReturned(id);
  }
}
