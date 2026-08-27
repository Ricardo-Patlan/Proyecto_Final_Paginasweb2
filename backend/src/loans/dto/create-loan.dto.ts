import { IsUUID } from 'class-validator';

// Solo pide el id del libro; el usuario que pide prestado se toma del
// token (@GetUser() en el controller), no del body.
export class CreateLoanDto {
  @IsUUID()
  bookId!: string;
}
