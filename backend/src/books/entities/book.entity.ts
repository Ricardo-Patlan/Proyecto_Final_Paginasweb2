import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

// Tabla 'books': el catalogo de la biblioteca.
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', {
    length: 255,
  })
  title!: string;

  @Column('varchar', {
    length: 255,
  })
  author!: string;

  // Codigo unico del libro, no se permiten repetidos.
  @Column('varchar', {
    length: 20,
    unique: true,
  })
  isbn!: string;

  @Column('text', {
    nullable: true,
  })
  description!: string;

  // Copias disponibles para prestar.
  @Column('int', {
    default: 0,
  })
  stock!: number;

  // eager: true trae siempre la categoria junto con el libro, sin pedirla
  // aparte con 'relations'. onDelete: 'SET NULL' evita que borrar una
  // categoria rompa los libros que la usaban.
  @ManyToOne(() => Category, { eager: true, nullable: true, onDelete: 'SET NULL' })
  category!: Category | null;
}
