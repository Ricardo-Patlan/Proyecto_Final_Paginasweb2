import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

// DTO reutilizable: cualquier modulo con listados paginados (Books,
// Categories, Loans...) lo usa con @Query() paginationDto: PaginationDto.
export class PaginationDto {
  // Cuantos resultados devolver como maximo. Opcional; si no se envia, cada
  // service decide un valor por defecto (normalmente 10).
  @IsOptional()
  @IsPositive()
  // Los query params siempre llegan como texto (ej. '10'). @Type(() => Number)
  // le dice a class-transformer que lo convierta a numero antes de validar.
  @Type(() => Number)
  limit?: number;

  // Cuantos resultados saltar (para paginar hacia adelante).
  // @Min(0) en vez de @IsPositive(): offset si puede ser 0 (la primera pagina).
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
