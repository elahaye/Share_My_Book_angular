import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Book } from '../interface/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  findAll() {
    return this.http
      .get(environment.apiUrl + '/books', {
        headers: {
          Authorization: 'Bearer ' + this.auth.getToken(),
        },
      })
      .pipe(map((data: Book[]) => data['hydra:member'] as Book[]));
  }

  create(book: Book) {
    return this.http.post<Book>(environment.apiUrl + '/books', book, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken(),
      },
    });
  }
}
