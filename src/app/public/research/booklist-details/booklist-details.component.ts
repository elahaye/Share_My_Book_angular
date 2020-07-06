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

    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.booklistService.find(this.id).subscribe((booklist) => {
      if (booklist.creatorId.avatar.length !== 0) {
        booklist.creatorId.avatar = booklist.creatorId.avatar.replace(
          '/api/media_objects/',
          ''
        );

        this.userService
          .getFile(booklist.creatorId.avatar)
          .subscribe((avatar: any) => {
            booklist.creatorId.avatar =
              environment.appliUrl + avatar.contentUrl;
            this.booklist = booklist;
            this.ui.setLoading(false);
          });
      } else {
        this.booklist = booklist;
        this.ui.setLoading(false);
      }
      this.booklist = booklist;
      this.ui.setLoading(false);
    });
  }
}
