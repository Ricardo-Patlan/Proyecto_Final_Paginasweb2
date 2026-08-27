import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Tabla 'categories': agrupa los libros por tema (ej. Novela, Historia).
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // No se permiten nombres repetidos.
  @Column('varchar', {
    length: 100,
    unique: true,
  })
  name!: string;

  // Opcional, por eso nullable: true.
  @Column('text', {
    nullable: true,
  })
  description!: string;
}
