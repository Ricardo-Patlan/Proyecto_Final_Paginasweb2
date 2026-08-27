import * as bcrypt from 'bcrypt';

interface SeedUser {
  email: string;
  fullName: string;
  password: string;
  roles: string[];
}

interface SeedCategory {
  name: string;
  description: string;
}

interface SeedBook {
  title: string;
  author: string;
  isbn: string;
  description: string;
  stock: number;
  // Nombre de la categoria (no el id): se resuelve en SeedService, ya que
  // el id real solo se conoce despues de insertar las categorias.
  categoryName: string;
}

interface SeedData {
  users: SeedUser[];
  categories: SeedCategory[];
  books: SeedBook[];
}

// Datos de ejemplo para llenar la base de datos con el endpoint /seed.
// Las contraseñas ya vienen hasheadas con bcrypt, igual que las guardaria
// AuthService.create() (aqui se insertan directo, sin pasar por esa ruta).
export const initialData: SeedData = {
  users: [
    {
      email: 'admin@biblioteca.com',
      fullName: 'Administrador',
      password: bcrypt.hashSync('Admin123', 10),
      roles: ['admin'],
    },
    {
      email: 'ana@biblioteca.com',
      fullName: 'Ana López',
      password: bcrypt.hashSync('Lector123', 10),
      roles: ['user'],
    },
    {
      email: 'carlos@biblioteca.com',
      fullName: 'Carlos Ramírez',
      password: bcrypt.hashSync('Lector123', 10),
      roles: ['user'],
    },
  ],
  categories: [
    { name: 'Novela', description: 'Historias de ficción narrativa' },
    { name: 'Ciencia Ficción', description: 'Mundos futuristas y tecnología especulativa' },
    { name: 'Historia', description: 'Libros sobre hechos y personajes históricos' },
    { name: 'Infantil', description: 'Libros para los lectores más pequeños' },
  ],
  books: [
    {
      title: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      isbn: '978-84-376-0494-7',
      description: 'La historia de la familia Buendía en el pueblo de Macondo.',
      stock: 3,
      categoryName: 'Novela',
    },
    {
      title: 'Don Quijote de la Mancha',
      author: 'Miguel de Cervantes',
      isbn: '978-84-376-0495-4',
      description: 'Las aventuras del ingenioso hidalgo y su fiel escudero Sancho Panza.',
      stock: 2,
      categoryName: 'Novela',
    },
    {
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      isbn: '978-84-450-7228-1',
      description: 'Un futuro donde los libros estan prohibidos y se queman.',
      stock: 4,
      categoryName: 'Ciencia Ficción',
    },
    {
      title: 'Un Mundo Feliz',
      author: 'Aldous Huxley',
      isbn: '978-84-450-7229-8',
      description: 'Una sociedad futura controlada por la ciencia y el condicionamiento.',
      stock: 2,
      categoryName: 'Ciencia Ficción',
    },
    {
      title: 'Sapiens: De Animales a Dioses',
      author: 'Yuval Noah Harari',
      isbn: '978-84-9992-622-3',
      description: 'Un recorrido por la historia de la humanidad.',
      stock: 3,
      categoryName: 'Historia',
    },
    {
      title: 'Breve Historia del Tiempo',
      author: 'Stephen Hawking',
      isbn: '978-84-08-04141-7',
      description: 'Una explicación accesible sobre el origen y destino del universo.',
      stock: 2,
      categoryName: 'Historia',
    },
    {
      title: 'El Principito',
      author: 'Antoine de Saint-Exupéry',
      isbn: '978-84-9838-284-2',
      description: 'Un piloto perdido en el desierto conoce a un pequeño príncipe de otro planeta.',
      stock: 5,
      categoryName: 'Infantil',
    },
    {
      title: 'Alicia en el País de las Maravillas',
      author: 'Lewis Carroll',
      isbn: '978-84-9838-285-9',
      description: 'Una niña cae por una madriguera hacia un mundo fantástico.',
      stock: 3,
      categoryName: 'Infantil',
    },
  ],
};
