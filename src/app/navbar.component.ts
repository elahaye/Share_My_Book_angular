import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" routerLink="/">Share My Book</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor03"
        aria-controls="navbarColor03"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor03">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active" *ngIf="!isAuthenticated">
            <a class="nav-link" routerLink="/research">Recherche</a>
          </li>
          <li class="nav-item active" *ngIf="isAuthenticated">
            <a class="nav-link" routerLink="/profil-booklists">Mes bookLists</a>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <ng-container *ngIf="!isAuthenticated">
            <li class="nav-item">
              <a routerLink="/register" class="nav-link">Inscription</a>
            </li>
            <li class="nav-item">
              <a routerLink="/login" class="btn btn-primary">Connnexion</a>
            </li>
          </ng-container>
          <li class="nav-item" *ngIf="isAuthenticated">
            <button class="btn btn-warning" (click)="handleLogout()">
              Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();

    this.auth.authChanged.subscribe((value) => {
      if (!value && this.isAuthenticated) {
        this.router.navigateByUrl('/login');
      }

      this.isAuthenticated = value;
    });
  }

  handleLogout() {
    // Supprimer le token
    this.auth.logout();
  }
}
