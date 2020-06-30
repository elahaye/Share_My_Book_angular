import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    nickname: new FormControl(''),
    email: new FormControl(''),
    avatar: new FormControl(''),
    password: new FormControl(''),
    confirmation: new FormControl(''),
  });
  submitted = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  getErrorForControl(controlName: string) {
    return this.form.controls[controlName].getError('invalid');
  }

  handleSubmit() {
    this.form.value.registrationDate = new Date('1995-12-17T03:24:00');
    console.log(this.form.value);

    this.userService.create(this.form.value).subscribe(
      (user) => {
        this.router.navigateByUrl('/login');
      },
      (error: HttpErrorResponse) => {
        // 2 Types d'erreur possibles :
        // 1) Une erreur 400 avec des violations
        if (error.status === 400 && error.error.violations) {
          for (const violation of error.error.violations) {
            const nomDuChamp = violation.propertyPath;
            const message = violation.message;

            this.form.controls[nomDuChamp].setErrors({
              invalid: message,
            });
          }
          return;
        }
        // 2) Tout autre type d'erreur
      }
    );
  }
}
