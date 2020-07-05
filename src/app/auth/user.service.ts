import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  handleError;

  constructor(private http: HttpClient) {}

  postFile(fileToUpload: File) {
    const endpoint = environment.apiUrl + '/media_objects';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData);
  }

  create(user: User) {
    //Appel POST
    return this.http.post<User>(environment.apiUrl + '/users', user);
    // return this.http.post<User>('http://localhost:3000/api/users', user);
  }
}
