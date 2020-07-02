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

const routes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'research', component: ResearchComponent },
  { path: 'profil-booklists', component: ProfilBooklistsComponent },
  { path: 'booklist/create', component: BooklistCreateComponent },
  { path: 'booklist/edit/:id', component: BooklistEditComponent },
  { path: 'booklist/:id', component: BooklistsDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
