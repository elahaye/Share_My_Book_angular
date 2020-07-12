import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../interface/user';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2';

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
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    confirmation: new FormControl('', Validators.required),
  });
  submitted = false;
  error = '';
  fileToUpload: File = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {}

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
  uploadFileToActivity() {
    this.userService.postFile(this.fileToUpload).subscribe(
      (data) => {
        data = this.fileToUpload;
      },
      (error) => {
        this.error =
          'Une erreur est survenue lors du téléchargement de votre image. Veuillez nous excusez de ce désafgrément.';
      }
    );
  }

  registerUser(values, validation) {
    if (this.form.value.password === this.form.value.confirmation) {
      this.userService.create(values).subscribe(
        (user) => {
          validation;
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            onOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          this.router.navigateByUrl('/login');
          Toast.fire({
            icon: 'success',
            title: 'Enregistrement réussi ! Connectez-vous maintenant !',
          });
        },
        (error) => {
          this.error =
            'Une erreur est survenue lors de la création de votre compte. Veuillez nous excusez pour ce désagrément. Réessayez de nouveau !';
        }
      );
    } else {
      this.error =
        'Le mot de passe indiqué et sa confirmation ne corresponsent pas. Veuillez recommencer.';
    }
  }

  handleSubmit() {
    this.error = '';
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-warning ml-1',
        cancelButton: 'btn btn-secondary mr-1',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Avez-vous bien vérifier vos informations ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, vas-y',
        cancelButtonText: 'Non, annule',
        reverseButtons: true,
      })
      .then((result) => {
        let validation = swalWithBootstrapButtons.fire(
          'Validation',
          'Votre enregistrement est un succès.',
          'success'
        );

        if (result.value) {
          this.form.value.registrationDate = new Date();
          this.form.value.roles = ['ROLE_USER'];

          if (this.fileToUpload == null) {
            this.registerUser(this.form.value, validation);
          } else {
            this.userService.postFile(this.fileToUpload).subscribe(
              (data) => {
                this.form.value.avatar = data['@id'];

                this.registerUser(this.form.value, validation);
              },
              (error) => {
                this.error =
                  'Une erreur est survenue lors du téléchargement de votre image. Veuillez nous excusez de ce désagrément.';
              }
            );
          }
        }
      });
  }
}
