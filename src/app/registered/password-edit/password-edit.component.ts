import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiService } from 'src/app/ui/ui.service';
import { AuthService } from 'src/app/service/auth.service';
import { User } from 'src/app/interface/user';
import { UserService } from 'src/app/service/user.service';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-password-edit',
  templateUrl: './password-edit.component.html',
  styleUrls: ['./password-edit.component.scss'],
})
export class PasswordEditComponent implements OnInit {
  user: User;
  form = new FormGroup({
    previousPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    confirmation: new FormControl('', Validators.required),
  });
  error = '';
  submitted = false;

  constructor(
    private router: Router,
    private ui: UiService,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const token = window.localStorage.getItem('token');

    const data: any = jwtDecode(token);

    this.ui.setLoading(true);

    this.userService.find(data.id).subscribe(
      (user) => {
        this.user = user;
        this.ui.setLoading(false);
      },
      (error) => {
        this.error =
          'Une erreur semble être survenue lors du chargement de la page. veuillez nous excusez pour le désagrément.';
        this.ui.setLoading(false);
      }
    );
  }

  handleSubmit() {
    this.error = '';
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    let login = {
      username: this.user.email,
      password: this.form.value.previousPassword,
    };
    this.auth.authenticate(login).subscribe(
      (data) => {
        if (
          this.form.value.newPassword === this.form.value.confirmation &&
          this.form.value.newPassword.length > 0
        ) {
          let updatedPassword = {
            previousPassword: this.form.value.previousPassword,
            newPassword: this.form.value.newPassword,
            confirmation: this.form.value.confirmation,
          };
          this.userService.updatePassword(updatedPassword).subscribe(
            () => {
              this.router.navigateByUrl('/profil');
            },
            (error) => {
              this.error =
                'Malheureusement, une erreur semble être survenu, veuillez nous excusez pour le désagrément.';
            }
          );
        } else {
          this.error =
            'Le nouveau mot de passe et sa confirmation ne correspondent pas.';
        }
      },
      (error) => {
        this.error = 'Le mot de passe actuel ne semble pas être le bon.';
      }
    );
  }
}
