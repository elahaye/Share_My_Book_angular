export interface User {
  id?: number;
  nickname: string;
  email: string;
  avatar: any;
  roles?: any;
  password: string;
  confirmation?: string;
  booklists?: any;
}
