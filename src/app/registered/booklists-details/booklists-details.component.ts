import { Component, OnInit } from '@angular/core';
import { BooklistService } from '../../service/booklist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Booklist } from '../../interface/booklist';
import { UiService } from 'src/app/ui/ui.service';
import { CategoryService } from '../../service/category.service';
import { Category } from '../../interface/category';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booklists-details',
  templateUrl: './booklists-details.component.html',
  styleUrls: ['./booklists-details.component.scss'],
})
export class BooklistsDetailsComponent implements OnInit {
  error = '';
  id: number;
  booklist: Booklist;

  constructor(
    private booklistService: BooklistService,
    private categoryService: CategoryService,
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
            this.booklist = booklist;
            this.ui.setLoading(false);
          },
          (error) => {
            this.error =
              'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez pour le désagrément.';
          }
        );
      },
      (error) => {
        this.error =
          'Une erreur semble être survenue lors du chargement de la page. Veuillez nous excusez pour le désagrément.';
      }
    );
  }

  handleDelete(booklist: Booklist) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-secondary ml-1',
        cancelButton: 'btn btn-warning mr-1',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Etes-vous sûre de vouloir supprimer cette booklist ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, vas-y',
        cancelButtonText: 'Non, annule',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.booklistService.delete(booklist.id).subscribe(
            () => {
              swalWithBootstrapButtons.fire(
                'Supppression',
                'Votre booklist a bien été supprimée.',
                'success'
              );
              this.router.navigateByUrl('/profil');
            },
            (error) => {
              this.error =
                'Une erreur semble être survenue lors de la suppression de la booklist. Veuillez nous excusez pour le désagréement.';
            }
          );
        }
      });
  }
}
