import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UiService } from 'src/app/ui/ui.service';
import { Booklist } from 'src/app/interface/booklist';
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

  error = '';
  havingResult = false;
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
    this.form.valueChanges.subscribe((values) => {
      this.handleSubmit();
    });
    this.booklistService.findAll().subscribe(
      (booklists) => {
        for (let i = 0; i < booklists.length; i++) {
          this.booklists.push(booklists[i]);
        }
      },
      (error) => {
        this.ui.setLoading(false);
        this.error =
          'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez du désagrément.';
      }
    );
    this.userService.findAll().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        this.ui.setLoading(false);
        this.error =
          'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez du désagrément.';
      }
    );
    this.categoryService.findAll().subscribe(
      (categories) => {
        for (let i = 0; i < categories.length; i++) {
          this.form.addControl(categories[i]['name'], new FormControl(false));
        }
        this.categories = categories.sort((a, b) => (a.name > b.name ? 1 : -1));
        this.loading = false;
        this.ui.setLoading(false);
      },
      (error) => {
        this.ui.setLoading(false);
        this.error =
          'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez du désagrément.';
      }
    );
  }

  handleSubmit() {
    this.error = '';
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
      this.havingResult = true;
    } else {
      this.havingResult = false;
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
