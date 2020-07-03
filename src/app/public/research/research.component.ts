import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UiService } from 'src/app/ui/ui.service';
import { BooklistService } from '../booklist.service';
import { Booklist } from 'src/app/registered/booklist';
import { EventEmitter } from 'protractor';
import { UserService } from 'src/app/registered/user.service';
import { CategoryService } from 'src/app/registered/category.service';
import { User } from 'src/app/auth/user';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
})
export class ResearchComponent implements OnInit {
  form = new FormGroup({
    research: new FormControl(''),
  });
  booklists: Booklist[] = [];
  users: User[] = [];
  filteredBooklists: Booklist[] = [];
  filteredUsers: User[] = [];

  constructor(
    private ui: UiService,
    private booklistService: BooklistService,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.ui.setLoading(true);
    this.booklistService.findAll().subscribe((result) => {
      for (let i = 0; i < result.length; i++) {
        this.booklists.push(result[i]);
      }
      this.ui.setLoading(false);
    });
    this.userService.findAll().subscribe((result) => {
      console.log(result);
      this.users = result;
      this.ui.setLoading(false);
    });
  }

  handleSubmit() {
    this.ui.setLoading(true);
    let input = this.form.value['research'];
    this.autoCompleteExpenseList(input);
  }

  autoCompleteExpenseList(input) {
    this.filteredBooklists = this.filterList(this.booklists, 'name', input);
    this.filteredUsers = this.filterList(this.users, 'nickname', input);
    this.ui.setLoading(false);
  }

  filterList(list, name, value) {
    var categoryList = [];
    if (typeof value != 'string') {
      return [];
    }
    if (value === '' || value === null) {
      return [];
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i][name].toLowerCase().includes(value)) {
        categoryList.push(list[i]);
      }
    }
    return categoryList;
  }
}
