import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/interface/user';
import { UiService } from 'src/app/ui/ui.service';
import jwtDecode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { UserService } from '../../service/user.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-profil-edit',
  templateUrl: './profil-edit.component.html',
  styleUrls: ['./profil-edit.component.scss'],
})
export class ProfilEditComponent implements OnInit {
  user: User;
  updatedValues: User;
  updatedUser: User;
  form = new FormGroup({
    nickname: new FormControl('', Validators.required),
    avatar: new FormControl(''),
    previousPassword: new FormControl(''),
    newPassword: new FormControl(''),
    confirmation: new FormControl(''),
  });
  error = '';
  submitted = false;
  fileToUpload: File = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private ui: UiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const token = window.localStorage.getItem('token');

    const data: any = jwtDecode(token);

    this.ui.setLoading(true);

    this.userService.find(data.id).subscribe(
      (user) => {
        if (user.hasOwnProperty('booklists')) {
          let booklists = [];
          for (let i = 0; i < user.booklists.length; i++) {
            booklists.push(user.booklists[i]['@id']);
          }
          user.booklists = booklists;
        }

        this.user = user;

        this.form.patchValue({ nickname: this.user.nickname });

        this.ui.setLoading(false);
      },
      (error) => {
        this.error =
          'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez pour le désagrément.';
        this.ui.setLoading(false);
      }
    );
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

  updateCurrentUser(updatedUser) {
    this.userService.update(updatedUser).subscribe(
      (user) => {
        this.router.navigateByUrl('/profil');
      },
      (error) => {
        this.error =
          'Malheureusement, une erreur semble être survenu, veuillez nous excusez pour le désagrément.';
      }
    );
  }

  handleSubmit() {
    this.error = '';
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    if (this.fileToUpload == null) {
      this.updatedUser = { ...this.user, nickname: this.form.value.nickname };
      this.updateCurrentUser(this.updatedUser);
    } else {
      this.userService.postFile(this.fileToUpload).subscribe(
        (data) => {
          this.form.value.avatar = data['@id'];
          this.updatedUser = {
            ...this.user,
            nickname: this.form.value.nickname,
            avatar: this.form.value.avatar,
          };
          this.updateCurrentUser(this.updatedUser);
        },
        (error) => {
          this.error =
            'Malheureusement, une erreur semble être survenue lors du téléchargement de votre image. Veuillez nous excusez pour le désagrément. ';
        }
      );
    }
  }
}
