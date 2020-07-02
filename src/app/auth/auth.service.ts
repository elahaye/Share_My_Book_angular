import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChanged = new Subject<boolean>();

  constructor(private http: HttpClient) {
    interval(5000).subscribe(() => {
      this.authChanged.next(this.isAuthenticated());
    });
  }

  isAuthenticated() {
    const token = window.localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const data: any = jwtDecode(token);

    // console.log(data);

    // // Comment comparer la date ACTUELLE et la date d'expiration ?
    return data.exp * 1000 > Date.now();

    // return window.localStorage.getItem('token') !== null;
  }

  logout() {
    window.localStorage.removeItem('token');
    this.authChanged.next(false);
  }

  authenticate(credentials: Credentials) {
    return this.http
      .post(environment.apiUrl + '/login_check', credentials)
      .pipe(
        tap((data: { token: string }) => {
          // Faire quelque chose avec
          window.localStorage.setItem('token', data.token);
          // Prévenir tout le monde
          this.authChanged.next(true);
        })
      );
  }

  getToken() {
    return window.localStorage.getItem('token');
  }
}

export interface Credentials {
  username: string;
  password: string;
}
