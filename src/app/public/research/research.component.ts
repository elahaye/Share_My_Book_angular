import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { UiService } from 'src/app/ui/ui.service';
import { Booklist } from 'src/app/interface/booklist';
import { EventEmitter } from 'protractor';
import { UserService } from 'src/app/service/user.service';
import { CategoryService } from 'src/app/service/category.service';
import { User } from 'src/app/interface/user';
import { Category } from 'src/app/interface/category';
import { BooklistService } from 'src/app/service/booklist.service';

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
  categories: Category[] = [];
  selectedCategories = [];
  filteredBooklists: Booklist[] = [];
  filteredUsers: User[] = [];

  error = false;
  loading = true;
  canView = false;

  constructor(
    private ui: UiService,
    private booklistService: BooklistService,
    private userService: UserService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.ui.setLoading(true);
    this.loading = true;
    this.booklistService.findAll().subscribe((booklists) => {
      for (let i = 0; i < booklists.length; i++) {
        this.booklists.push(booklists[i]);
      }
    });
    this.userService.findAll().subscribe((users) => {
      this.users = users;
    });
    this.categoryService.findAll().subscribe((categories) => {
      for (let i = 0; i < categories.length; i++) {
        this.form.addControl(categories[i]['name'], new FormControl(''));
      }
      this.categories = categories;
      this.loading = false;
      this.ui.setLoading(false);
    });
  }

  handleSubmit() {
    this.filteredBooklists = [];
    this.filteredUsers = [];

    this.selectedCategories = [];
    for (let i = 0; i < this.categories.length; i++) {
      if (this.form.value[this.categories[i]['name']] === true) {
        this.selectedCategories.push(this.categories[i]['name']);
      }
    }
    this.loading = true;
    let input = this.form.value['research'];
    this.autoCompleteExpenseList(input);
    this.loading = false;
    this.canView = true;
  }

  autoCompleteExpenseList(input) {
    if (this.selectedCategories.length === 0) {
      this.filteredBooklists = this.filterList(this.booklists, 'name', input);
      this.filteredUsers = this.filterList(this.users, 'nickname', input);
    } else {
      let fullBooklists = this.filterList(this.booklists, 'name', input);
      for (let i = 0; i < fullBooklists.length; i++) {
        for (let j = 0; j < this.selectedCategories.length; j++) {
          if (fullBooklists[i].hasOwnProperty('category')) {
            if (fullBooklists[i].category.name == this.selectedCategories[j]) {
              this.filteredBooklists.push(fullBooklists[i]);
            }
          }
        }
      }
    }

    if (
      this.filteredBooklists.length === 0 &&
      this.filteredUsers.length === 0
    ) {
      this.canView = false;
      this.error = true;
    } else {
      this.error = false;
    }
  }

  filterList(list, name, value) {
    var categoryList = [];
    if (typeof value != 'string') {
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
