import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UiService } from './ui/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Share My Book';
  loading = false;

  constructor(private ui: UiService, private chRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.ui.loadingSubject.subscribe((value) => {
      this.loading = value;
      this.chRef.detectChanges();
    });
  }
}
