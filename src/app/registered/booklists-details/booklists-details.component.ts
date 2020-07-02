import { Component, OnInit } from '@angular/core';
import { BooklistService } from '../booklist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Booklist } from '../booklist';
import { UiService } from 'src/app/ui/ui.service';

@Component({
  selector: 'app-booklists-details',
  templateUrl: './booklists-details.component.html',
  styleUrls: ['./booklists-details.component.scss'],
})
export class BooklistsDetailsComponent implements OnInit {
  id: number;
  booklist: Booklist;

  constructor(
    private booklistService: BooklistService,
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
      this.booklist = booklist;
      this.ui.setLoading(false);
    });
  }

  handleDelete(booklist: Booklist) {
    this.booklistService.delete(booklist.id).subscribe(() => {});
    this.router.navigateByUrl('/profil-booklists');
  }
}
