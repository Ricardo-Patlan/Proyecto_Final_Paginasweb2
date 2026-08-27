import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// PartialType: reutiliza CreateCategoryDto pero vuelve todas sus propiedades
// opcionales, para poder actualizar solo algunos campos a la vez.
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
