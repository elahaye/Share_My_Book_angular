import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/auth/user';
import jwtDecode from 'jwt-decode';
import { UiService } from 'src/app/ui/ui.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profil-booklists',
  templateUrl: './profil-booklists.component.html',
  styleUrls: ['./profil-booklists.component.scss'],
})
export class ProfilBooklistsComponent implements OnInit {
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

          this.userService.getFile(user.avatar).subscribe((avatar: any) => {
            user.avatar = environment.appliUrl + avatar.contentUrl;
            this.user = user;
            this.ui.setLoading(false);
          });
        } else {
          this.user = user;
          this.ui.setLoading(false);
        }
      },
      (error) => {
        this.ui.setLoading(false);
      }
    );
  }
}
