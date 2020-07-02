import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar.component';
import { ResearchComponent } from './public/research/research.component';
import { FrontpageComponent } from './public/frontpage/frontpage.component';
import { BooklistService } from './public/booklist.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfilBooklistsComponent } from './registered/profil-booklists/profil-booklists.component';
import { BooklistsDetailsComponent } from './registered/booklists-details/booklists-details.component';
import { BooklistCreateComponent } from './registered/booklist-create/booklist-create.component';
import { BooklistEditComponent } from './registered/booklist-edit/booklist-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ResearchComponent,
    FrontpageComponent,
    LoginComponent,
    RegisterComponent,
    ProfilBooklistsComponent,
    BooklistsDetailsComponent,
    BooklistCreateComponent,
    BooklistEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [BooklistService],
  bootstrap: [AppComponent],
})
export class AppModule {}
