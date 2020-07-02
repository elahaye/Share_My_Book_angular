import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Category } from './category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  findAll() {
    return this.http
      .get(environment.apiUrl + '/categories', {
        headers: {
          Authorization: 'Bearer ' + this.auth.getToken(),
        },
      })
      .pipe(map((data: Category[]) => data['hydra:member'] as Category[]));
  }
}
