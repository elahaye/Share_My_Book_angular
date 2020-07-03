import { User } from '../auth/user';
import { Book } from './book';

export interface Booklist {
  id?: number;
  creatorId: any;
  category?: any;
  name: string;
  status: string;
  createdAt: any;
  books: any;
}
