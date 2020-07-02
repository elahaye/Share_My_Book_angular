import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booklist } from './booklist';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BooklistService {
  constructor(private http: HttpClient, private auth: AuthService) {}

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
      booklist
    );
  }

  update(booklist: Booklist) {
    return this.http.put<Booklist>(
      environment.apiUrl + '/booklists/' + booklist.id,
      booklist
    );
  }
}
