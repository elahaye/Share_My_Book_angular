import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interface/user';
import { UserService } from 'src/app/service/user.service';
import { UiService } from 'src/app/ui/ui.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  error = '';
  user: User;
  id: number;

  constructor(
    private userService: UserService,
    private ui: UiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ui.setLoading(true);

    this.route.params.subscribe(
      (params) => {
        this.id = params['id'];
        this.userService.findPublic(this.id).subscribe(
          (user) => {
            let filteredBooklists = [];
            for (let i = 0; i < user.booklists.length; i++) {
              if (user.booklists[i].status == 'public') {
                filteredBooklists.push(user.booklists[i]);
              }
            }
            user.booklists = filteredBooklists;

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
                    "Une erreur semble être survenue lors du chargement de l'avatar du créateur. Veuillez nous excusez de ce désagrément.";
                }
              );
            } else {
              this.user = user;
              this.ui.setLoading(false);
            }
          },
          (error) => {
            this.error =
              'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez de ce désagrément.';
            this.ui.setLoading(false);
          }
        );
      },
      (error) => {
        this.error =
          'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez de ce désagrément.';
      }
    );
  }
}
