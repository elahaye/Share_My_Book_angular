import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from '../interface/user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  postFile(fileToUpload: File) {
    const endpoint = environment.apiUrl + '/media_objects';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData);
  }

  getFile(id: number) {
    return this.http.get(environment.apiUrl + '/media_objects/' + id);
  }

  create(user: User) {
    //Appel POST
    return this.http.post<User>(environment.apiUrl + '/users', user);
    // return this.http.post<User>('http://localhost:3000/api/users', user);
  }

  update(user: User) {
    return this.http.put<User>(environment.apiUrl + '/users/' + user.id, user, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken(),
      },
    });
  }

  updatePassword(data) {
    return this.http.put(environment.apiUrl + '/users/update-password', data, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken(),
      },
    });
  }

  findAll() {
    return this.http
      .get(environment.apiUrl + '/users')
      .pipe(map((data: User[]) => data['hydra:member'] as User[]));
  }

  find(id: number) {
    return this.http.get<User>(environment.apiUrl + '/users/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken(),
      },
    });
  }

  findPublic(id: number) {
    return this.http.get<User>(environment.apiUrl + '/users/' + id);
  }
}
