import { Injectable, OnInit } from '@angular/core';
import {
  environment as env,
  environment,
} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Booklist } from '../registered/booklist';
@Injectable({
  providedIn: 'root',
})
export class BooklistService {
  constructor(private http: HttpClient) {}

  findAll() {
    return this.http
      .get(environment.apiUrl + '/booklists?status=public')
      .pipe(map((data: Booklist[]) => data['hydra:member'] as Booklist[]));
  }
}
