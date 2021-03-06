import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interface/user';
import jwtDecode from 'jwt-decode';
import { UiService } from 'src/app/ui/ui.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profil-booklists',
  templateUrl: './profil-booklists.component.html',
  styleUrls: ['./profil-booklists.component.scss'],
})
export class ProfilBooklistsComponent implements OnInit {
  error = '';
  user: User;

  constructor(private userService: UserService, private ui: UiService) {}

  ngOnInit(): void {
    const token = window.localStorage.getItem('token');

    const data: any = jwtDecode(token);

    this.ui.setLoading(true);

    this.userService.find(data.id).subscribe(
      (user) => {
        if (user.avatar.length !== 0) {
          user.avatar = user.avatar.replace('/api/media_objects/', '');

          this.userService.getFile(user.avatar).subscribe(
            (avatar: any) => {
              user.avatar = environment.mediaUrl + avatar.contentUrl;
              this.user = user;
              this.ui.setLoading(false);
            },
            (error) => {
              this.error =
                'Une erreur semble être survenue lors du chargement de votre avatar. euillez nous excusez pour le désagrément.';
            }
          );
        } else {
          this.user = user;
          this.ui.setLoading(false);
        }
      },
      (error) => {
        this.error =
          'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez pour le désagrément.';
        this.ui.setLoading(false);
      }
    );
  }
}
