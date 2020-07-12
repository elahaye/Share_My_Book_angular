import { Component, OnInit } from '@angular/core';
import { Booklist } from 'src/app/interface/booklist';
import { CategoryService } from 'src/app/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/ui/ui.service';
import { BooklistService } from 'src/app/service/booklist.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-booklist-details',
  templateUrl: './booklist-details.component.html',
  styleUrls: ['./booklist-details.component.scss'],
})
export class BooklistDetailsComponent implements OnInit {
  error = '';
  id: number;
  booklist: Booklist;

  constructor(
    private booklistService: BooklistService,
    private categoryService: CategoryService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    this.ui.setLoading(true);

    this.route.params.subscribe(
      (params) => {
        this.id = params['id'];
        this.booklistService.find(this.id).subscribe(
          (booklist) => {
            let avatarId;
            if (booklist.creatorId.avatar.length !== 0) {
              avatarId = booklist.creatorId.avatar.replace(
                '/api/media_objects/',
                ''
              );
              booklist.creatorId.avatar = '';

              this.userService.getFile(avatarId).subscribe(
                (avatar: any) => {
                  booklist.creatorId.avatar =
                    environment.appliUrl + avatar.contentUrl;
                  this.booklist = booklist;
                  this.ui.setLoading(false);
                },
                (error) => {
                  this.ui.setLoading(false);
                  this.error =
                    "Une erreur est survenue lors du chargement de l'avatar du créateur. Veuillez nous excusez du désagrément.";
                }
              );
            } else {
              this.booklist = booklist;
              this.ui.setLoading(false);
            }
            this.booklist = booklist;
            this.ui.setLoading(false);
          },
          (error) => {
            this.ui.setLoading(false);
            this.error =
              'Une erreur est survenue lors du chargement de la page. Veuillez nous excusez du désagrément.';
          }
        );
      },
      (error) => {
        this.ui.setLoading(false);
        this.error =
          'Une erreur est survenue lors du chargement de la page. Veuillez nous excusez du désagrément.';
      }
    );
  }
}
