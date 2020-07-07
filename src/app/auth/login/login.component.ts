import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  error = '';
  submitted = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  handleSubmit() {
    this.error = '';
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.auth.authenticate(this.form.value).subscribe(
      (data) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        this.router.navigateByUrl('/profil');
        Toast.fire({
          icon: 'success',
          title: 'De retour sur votre site favori !',
        });
      },
      (error) => {
        this.error =
          'Une erreur est survenue lors de votre authentification. Veuillez nous excusez de ce désagrément. Réessayez de nouveau !';
      }
    );
  }
}
