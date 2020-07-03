import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../category.service';
import { Category } from '../category';
import { BookService } from '../book.service';
import { Book } from '../book';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BooklistService } from '../booklist.service';
import { Booklist } from '../booklist';
import { User } from 'src/app/auth/user';
import { map, switchMap } from 'rxjs/operators';
import { UiService } from 'src/app/ui/ui.service';

@Component({
  selector: 'app-booklist-edit',
  templateUrl: './booklist-edit.component.html',
  styleUrls: ['./booklist-edit.component.scss'],
})
export class BooklistEditComponent implements OnInit {
  user: User;
  categories: Category[] = [];
  status = ['public', 'privé'];
  booksChosenList = [];
  apiPlatformBooks: Book[] = [];

  booklistForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl(this.categories),
    status: new FormControl(this.status),
  });
  previousBooklist: Booklist;

  bookUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
  booksFromGoogleApi: [];

  researchForm = new FormGroup({
    researchInput: new FormControl(''),
  });

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private bookService: BookService,
    private booklistService: BooklistService,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    this.ui.setLoading(true);

    this.categoryService.findAll().subscribe((categories) => {
      this.categories = categories.map((item) => ({
        ...item,
        id: item.id.toString(),
      }));
    });

    // TODO: Aller chercher le customer via l'API (basé sur l'id qui est dans la route)
    this.route.paramMap
      .pipe(
        map((params) => +params.get('id')),
        switchMap((id) => this.booklistService.find(id))
      )
      .subscribe((booklist) => {
        this.previousBooklist = booklist;
        if (this.previousBooklist.hasOwnProperty('category')) {
          const splittedCategory = this.previousBooklist.category.split('/');
          this.previousBooklist.category =
            splittedCategory[splittedCategory.length - 1];
        }

        this.booklistForm.patchValue(this.previousBooklist);

        for (let i = 0; i < booklist['books'].length; i++) {
          this.booksChosenList.push(booklist['books'][i]);
        }
        this.ui.setLoading(false);
      });
  }

  researchBook() {
    this.http
      .get(this.bookUrl + this.researchForm.value['researchInput'])
      .pipe(
        map((result) =>
          result['items'].map((book) => {
            return {
              referenceApi: book['id'],
              title: book['volumeInfo']['title'],
              author: book['volumeInfo']['authors'],
              publicationDate: book['volumeInfo']['publishedDate'],
              totalPages: book['volumeInfo']['pageCount'],
              image: book['volumeInfo']['imageLinks']['smallThumbnail'],
            };
          })
        )
      )
      .subscribe((result) => {
        this.booksFromGoogleApi = result;
      });
  }

  addToList(book) {
    book.author = book.author.join(', ');
    this.booksChosenList.push(book);
  }

  deleteFromList(book) {
    let index = this.booksChosenList.indexOf(book);
    this.booksChosenList.splice(index, 1);
  }

  handleSubmit() {
    let listBooksId = [];
    // BOOKS
    // 1. Rechercher dans les livres stockés sur API Platform si le livre est déjà présent
    this.bookService.findAll().subscribe((apiPlatformBooks) => {
      this.apiPlatformBooks = apiPlatformBooks;
      const booksToCreate: Book[] = []; // Stocke les livres non-présents dans la BD

      this.researchBookExistenceInDatabase(
        listBooksId,
        apiPlatformBooks,
        this.booksChosenList,
        booksToCreate
      );

      if (booksToCreate.length === 0) {
        this.updateBooklist(listBooksId);
      } else {
        this.createNewBooks(booksToCreate, listBooksId);
      }
    });
  }

  researchBookExistenceInDatabase(
    listBooksId,
    apiPlatformBooks,
    booksChosenList,
    booksToCreate
  ) {
    let stocked = true;

    // 2. S'il l'est, annuler l'action // S'il ne l'est pas, l'ajouter
    booksChosenList.forEach(function (book) {
      for (let i = 0; i < apiPlatformBooks.length; i++) {
        // Si le num de référencement du livre est le même que celui présent dans la BD, ne rien faire
        if (book['referenceApi'] == apiPlatformBooks[i]['referenceApi']) {
          listBooksId.push(apiPlatformBooks[i]['id']);
          stocked = true;
          break;
        } else {
          // S'il n'est pas présent, le créer
          stocked = false;
        }
      }
      if (stocked === false) {
        booksToCreate.push(book);
      }
    });
  }

  createNewBooks(booksToCreate, listBooksId) {
    const listCallHttpCreateBook = booksToCreate.map((item) =>
      this.bookService.create(item)
    );

    forkJoin(listCallHttpCreateBook).subscribe((result) => {
      for (let i = 0; i < result.length; i++) {
        listBooksId.push(result[i]['id']);
      }
      this.updateBooklist(listBooksId);
    });
  }

  updateBooklist(listBooksId) {
    // BOOKLIST

    const listBooksIdToUpload = [];

    for (let i = 0; i < listBooksId.length; i++) {
      listBooksIdToUpload.push(`api/books/${listBooksId[i]}`);
    }

    let updatedBooklist = {
      id: this.previousBooklist.id,
      creatorId: this.previousBooklist.creatorId,
      name: this.booklistForm.value['name'],
      category: 'api/categories/' + this.booklistForm.value['category'],
      status: this.booklistForm.value['status'],
      createdAt: this.previousBooklist.createdAt,
      books: listBooksIdToUpload,
    };

    this.booklistService.update(updatedBooklist).subscribe((result) => {});
    this.router.navigateByUrl('profil-booklists');
  }
}
