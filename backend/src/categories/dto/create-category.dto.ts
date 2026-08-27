import { IsOptional, IsString, MinLength } from 'class-validator';

// Datos que se esperan al crear una categoria (validados por el ValidationPipe global).
export class CreateCategoryDto {
  @IsString()
  @MinLength(1)
  name!: string;

  // No es obligatoria.
  @IsString()
  @IsOptional()
  description?: string;
}
