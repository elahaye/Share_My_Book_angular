import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booklist } from '../interface/booklist';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class BooklistService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  findAll() {
    return this.http
      .get(environment.apiUrl + '/booklists?status=public')
      .pipe(map((data: Booklist[]) => data['hydra:member'] as Booklist[]));
  }

  find(id: number) {
    return this.http.get<Booklist>(environment.apiUrl + '/booklists/' + id);
  }

  delete(id: number) {
    return this.http.delete<Booklist>(environment.apiUrl + '/booklists/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken(),
      },
    });
  }

  create(booklist: Booklist) {
    return this.http.post<Booklist>(
      environment.apiUrl + '/booklists',
      booklist,
      {
        headers: {
          Authorization: 'Bearer ' + this.auth.getToken(),
        },
      }
    );
  }

  update(booklist: Booklist) {
    return this.http.put<Booklist>(
      environment.apiUrl + '/booklists/' + booklist.id,
      booklist,
      {
        headers: {
          Authorization: 'Bearer ' + this.auth.getToken(),
        },
      }
    );
  }
}
