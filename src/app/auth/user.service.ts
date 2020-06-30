import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(user: User) {
    //Appel POST
    return this.http.post<User>(environment.apiUrl + '/users', user);
    // return this.http.post<User>('http://localhost:3000/api/users', user);
  }
}
