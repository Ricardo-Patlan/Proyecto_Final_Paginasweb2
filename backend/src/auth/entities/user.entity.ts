import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', {
    length: 255,
    unique: true,
  })
  email!: string;

  // select: false: por defecto NUNCA se trae en un find()/findOne() normal,
  // hay que pedirla explicitamente (usado en AuthService.login()).
  @Column('varchar', {
    length: 255,
    select: false,
  })
  password!: string;

  @Column('varchar', {
    length: 255,
  })
  fullName!: string;

  @Column('bool', {
    default: true,
  })
  isActive!: boolean;

  // MariaDB no soporta arreglos nativos como columna, se guarda como JSON.
  @Column('json')
  roles!: string[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    if (!this.roles) this.roles = ['user'];
  }

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailBeforeUpdate() {
    this.checkEmailBeforeInsert();
  }
}
