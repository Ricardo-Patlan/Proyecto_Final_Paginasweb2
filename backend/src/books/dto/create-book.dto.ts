import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

// Datos que se esperan al registrar un libro nuevo.
export class CreateBookDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  author!: string;

  @IsString()
  @MinLength(1)
  isbn!: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Numero entero positivo, opcional (si no se manda, el service pone 0).
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  // Id (uuid) de una categoria ya existente. Opcional: un libro puede
  // quedar sin categoria asignada todavia.
  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
