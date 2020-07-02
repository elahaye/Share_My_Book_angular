import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiViolation } from './apiviolation';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  loadingSubject = new Subject<boolean>();

  constructor() {}

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  fillViolationInForm(form: FormGroup, violations: ApiViolation[]) {
    for (const violation of violations) {
      const nomDuChamp = violation.propertyPath;
      const message = violation.message;

      form.controls[nomDuChamp].setErrors({
        invalid: message,
      });
    }
  }
}
