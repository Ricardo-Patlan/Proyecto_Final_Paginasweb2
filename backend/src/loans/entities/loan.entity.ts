import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../auth/entities/user.entity';

// Tabla 'loans': un prestamo relaciona un libro con el usuario que lo pidio.
@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // eager: true trae siempre el libro/usuario junto con el prestamo.
  @ManyToOne(() => Book, { eager: true })
  book!: Book;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  // Se llena sola al crear el registro.
  @CreateDateColumn()
  loanDate!: Date;

  // Se llena cuando el admin marca el prestamo como devuelto.
  @Column('datetime', { nullable: true })
  returnDate!: Date | null;

  // 'active' mientras el libro no se devuelve, 'returned' despues.
  @Column('varchar', { length: 20, default: 'active' })
  status!: 'active' | 'returned';
}
