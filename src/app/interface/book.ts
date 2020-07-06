export interface Book {
  id?: number;
  referenceApi: string;
  title: string;
  author: string;
  publicationDate: string;
  totalPages: number;
  image?: string;
}
