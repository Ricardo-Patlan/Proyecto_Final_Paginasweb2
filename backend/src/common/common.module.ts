import { Module } from '@nestjs/common';

// Modulo contenedor para cosas compartidas entre otros modulos que no
// pertenecen a ninguna funcionalidad especifica (por ejemplo, PaginationDto
// vive en common/dtos/, aunque este modulo no necesita declarar nada
// explicitamente para que ese DTO se pueda importar directamente por su ruta).
@Module({})
export class CommonModule {}
