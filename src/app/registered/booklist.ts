import { User } from '../auth/user';
import { Book } from './book';

export interface Booklist {
  id?: number;
  creatorId: string;
  category?: any;
  name: string;
  status: string;
  createdAt: any;
  books: any;
}
