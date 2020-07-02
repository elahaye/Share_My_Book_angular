import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  findAll() {
    return this.http
      .get(environment.apiUrl + '/users', {
        headers: {
          Authorization: 'Bearer ' + this.auth.getToken(),
        },
      })
      .pipe(map((data: User[]) => data['hydra:member'] as User[]));
  }

  find(id: number) {
    return this.http.get<User>(environment.apiUrl + '/users/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken(),
      },
    });
  }
}
