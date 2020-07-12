import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="bg-light pt-3 d-flex flex-row justify-content-around">
        <p>Copyright ◎ 2020 ShareMyBook.com</p>
        <p><i class="fab fa-facebook mr-2"></i>share_my_book</p>
        <p><i class="fab fa-twitter-square mr-2"></i>@sharemybook</p>
        <p><i class="fab fa-github mr-2"></i>share_my_book</p>
        <p><i class="far fa-envelope mr-2"></i>share_my_book@gmail.com</p>
      </div>
    </footer>
  `,
  styles: [],
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
