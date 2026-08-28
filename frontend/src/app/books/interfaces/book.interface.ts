export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string | null;
  stock: number;
  category: Category | null;
}
