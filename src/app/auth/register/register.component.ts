import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../interface/user';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form = new FormGroup({
    nickname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    avatar: new FormControl(''),
    password: new FormControl('', Validators.required),
    confirmation: new FormControl('', Validators.required),
  });
  submitted = false;
  fileToUpload: File = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  getErrorForControl(controlName: string) {
    return this.form.controls[controlName].getError('invalid');
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  uploadFileToActivity() {
    this.userService.postFile(this.fileToUpload).subscribe(
      (data) => {
        data = this.fileToUpload;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  registerUser(values) {
    this.userService.create(values).subscribe(
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

  handleSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.form.value.registrationDate = new Date();
    this.form.value.roles = ['ROLE_USER'];

    if (this.fileToUpload == null) {
      this.registerUser(this.form.value);
    } else {
      this.userService.postFile(this.fileToUpload).subscribe(
        (data) => {
          this.form.value.avatar = data['@id'];

          this.registerUser(this.form.value);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
