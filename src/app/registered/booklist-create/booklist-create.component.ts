import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../service/category.service';
import { Category } from '../../interface/category';
import { BookService } from '../../service/book.service';
import { Book } from '../../interface/book';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BooklistService } from '../../service/booklist.service';
import { Booklist } from '../../interface/booklist';
import { UserService } from '../../service/user.service';
import jwtDecode from 'jwt-decode';
import { User } from 'src/app/interface/user';
import { map, switchMap } from 'rxjs/operators';
import { UiService } from 'src/app/ui/ui.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booklist-create',
  templateUrl: './booklist-create.component.html',
  styleUrls: ['./booklist-create.component.scss'],
})
export class BooklistCreateComponent implements OnInit {
  error = '';
  submitted = false;
  user: User;
  categories: Category[] = [];
  status = ['public', 'privé'];
  booksChosenList = [];
  apiPlatformBooks: Book[] = [];

  booklistForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl(this.categories),
    status: new FormControl(this.status[0]),
  });

  bookUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
  booksFromGoogleApi: [];

  researchForm = new FormGroup({
    researchInput: new FormControl(''),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private categoryService: CategoryService,
    private bookService: BookService,
    private booklistService: BooklistService,
    private ui: UiService
  ) {}

  ngOnInit(): void {
    this.ui.setLoading(true);

    this.categoryService.findAll().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        this.error =
          'Une erreur est survenue lors du chargement de la page. Veuillez nous excuser du désagrément.';
      }
    );
    const token = window.localStorage.getItem('token');

    const data: any = jwtDecode(token);

    this.userService.find(data['id']).subscribe(
      (user) => {
        this.user = user;
        this.ui.setLoading(false);
      },
      (error) => {
        this.error =
          'Une erreur est survenue lors du chargement de la page. Veuillez nous excuser du désagrément.';
      }
    );
  }

  researchBook() {
    this.http
      .get(this.bookUrl + this.researchForm.value['researchInput'])
      .pipe(
        map((result) =>
          result['items'].map((book) => {
            if (book.volumeInfo.imageLinks === undefined) {
              book.volumeInfo.imageLinks = {
                smallThumbnail: '',
              };
            }

            if (book.volumeInfo.authors === undefined) {
              book.volumeInfo.authors = 'non-précisé';
            } else {
              if (book.volumeInfo.authors.length > 0) {
                book.volumeInfo.authors = book.volumeInfo.authors.join(' ');
              } else {
                book.volumeInfo.authors = book.volumeInfo.authors[0];
              }
            }
            return {
              referenceApi: book.id,
              title: book.volumeInfo.title,
              author: book.volumeInfo.authors,
              publicationDate:
                book.volumeInfo.publishedDate === undefined
                  ? '0000'
                  : book.volumeInfo.publishedDate,
              totalPages:
                book.volumeInfo.pageCount === undefined
                  ? 0
                  : book.volumeInfo.pageCount,
              image: book.volumeInfo.imageLinks.smallThumbnail,
            };
          })
        )
      )
      .subscribe(
        (result) => {
          this.booksFromGoogleApi = result;
        },
        (error) => {
          this.error =
            'Une erreur est survenue lors du chargement des résultats. Veuillez nous excuser du désagrément.';
        }
      );
  }

  addToList(book) {
    this.error = '';
    let isPresent = false;
    for (let i = 0; i < this.booksChosenList.length; i++) {
      if (this.booksChosenList[i].referenceApi === book.referenceApi) {
        this.error = 'Ce livre est déjà présent dans votre booklist.';
        isPresent = true;
        return;
      }
    }
    if (!isPresent) {
      this.booksChosenList.push(book);
    }
  }

  deleteFromList(book) {
    let index = this.booksChosenList.indexOf(book);
    this.booksChosenList.splice(index, 1);
  }

  handleSubmit() {
    this.error = '';
    this.submitted = true;

    if (this.booklistForm.invalid) {
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-warning ml-1',
        cancelButton: 'btn btn-secondary mr-1',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Etes-vous sûre de vouloir enregistrer votre booklist ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, vas-y',
        cancelButtonText: 'Non, annule',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          let listBooksId = [];
          // BOOKS
          // 1. Rechercher dans les livres stockés sur API Platform si le livre est déjà présent
          this.bookService.findAll().subscribe(
            (apiPlatformBooks) => {
              this.apiPlatformBooks = apiPlatformBooks;
              const booksToCreate: Book[] = []; // Stocke les livres non-présents dans la BD

              this.researchBookExistenceInDatabase(
                listBooksId,
                apiPlatformBooks,
                this.booksChosenList,
                booksToCreate
              );

              let validation = swalWithBootstrapButtons.fire(
                'Validation',
                'Votre booklist a bien été enregistrée.',
                'success'
              );

              if (booksToCreate.length === 0) {
                this.createNewBooklist(listBooksId, validation);
              } else {
                this.createNewBooks(booksToCreate, listBooksId, validation);
              }
            },
            (error) => {
              this.error =
                'Une erreur est survenue lors du chargement des livres. Veuillez nous excuser du désagrément.';
            }
          );
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
      if (!stocked) {
        booksToCreate.push(book);
      }
    });
  }

  createNewBooks(booksToCreate, listBooksId, validation) {
    const callHttpBooksToCreate = booksToCreate.map((item) =>
      this.bookService.create(item)
    );
    forkJoin(callHttpBooksToCreate).subscribe(
      (result: Book[]) => {
        for (let i = 0; i < result.length; i++) {
          listBooksId.push(result[i].id);
        }
        this.createNewBooklist(listBooksId, validation);
      },
      (error) => {
        this.error =
          'Une erreur est survenue lors du chargement des livres dans votre booklist. Veuillez nous excuser du désagrément.';
      }
    );
  }

  createNewBooklist(listBooksId, validation) {
    // BOOKLIST
    const listBooksIdToUpload = [];

    for (let i = 0; i < listBooksId.length; i++) {
      listBooksIdToUpload.push(`api/books/${listBooksId[i]}`);
    }

    let newBooklist: Booklist = {
      name: this.booklistForm.value['name'],
      category: 'api/categories/' + this.booklistForm.value['category'],
      status: this.booklistForm.value['status'],
      createdAt: new Date(),
      creatorId: '/api/users/' + this.user['id'],
      books: listBooksIdToUpload,
    };

    this.booklistService.create(newBooklist).subscribe(
      (result) => {
        validation;
        this.router.navigateByUrl('profil');
      },
      (error) => {
        this.error =
          'Une erreur est survenue lors de la création de votre booklist. Veuillez nous excuser du désagrément. Réessayez de nouveau.';
      }
    );
  }
}
