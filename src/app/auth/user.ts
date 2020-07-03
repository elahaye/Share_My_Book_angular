export interface User {
  id?: number;
  nickname: string;
  email: string;
  avatar: string;
  roles?: any;
  password: string;
  confirmation?: string;
}
