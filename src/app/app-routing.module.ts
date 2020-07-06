import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ResearchComponent } from './public/research/research.component';
import { FrontpageComponent } from './public/frontpage/frontpage.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfilBooklistsComponent } from './registered/profil-booklists/profil-booklists.component';
import { BooklistsDetailsComponent } from './registered/booklists-details/booklists-details.component';
import { BooklistCreateComponent } from './registered/booklist-create/booklist-create.component';
import { BooklistEditComponent } from './registered/booklist-edit/booklist-edit.component';
import { BooklistDetailsComponent } from './public/research/booklist-details/booklist-details.component';
import { UserDetailsComponent } from './public/research/user-details/user-details.component';
import { ProfilEditComponent } from './registered/profil-edit/profil-edit.component';
import { PasswordEditComponent } from './registered/password-edit/password-edit.component';

const routes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'research', component: ResearchComponent },
  { path: 'profil', component: ProfilBooklistsComponent },
  { path: 'profil/edit', component: ProfilEditComponent },
  { path: 'profil/edit/password', component: PasswordEditComponent },
  { path: 'booklist/create', component: BooklistCreateComponent },
  { path: 'booklist/edit/:id', component: BooklistEditComponent },
  { path: 'booklist/:id', component: BooklistsDetailsComponent },
  { path: 'research/booklist/:id', component: BooklistDetailsComponent },
  { path: 'research/user/:id', component: UserDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
