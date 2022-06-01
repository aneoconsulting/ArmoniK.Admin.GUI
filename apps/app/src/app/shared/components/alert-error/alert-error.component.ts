import { Component, Input } from '@angular/core';
import { AppError, LanguageService } from '../../../core';

@Component({
  selector: 'app-alert-error',
  templateUrl: './alert-error.component.html',
  styleUrls: ['./alert-error.component.scss'],
})
export class AlertErrorComponent {
  @Input() name = '';
  @Input() errors: AppError[] = [];

  constructor(private languageService: LanguageService) {}

  /**
   * Return translated error message using the status code
   *
   * @param error
   *
   * @returns translated error message
   */
  translateError(error: AppError): string {
    return this.languageService.instant(`${this.name}.errors.${error.status}`, {
      value: error.id,
      name: error.operation,
    });
  }

  /**
   * Used to track error for ngFor
   */
  trackByError(index: number) {
    return index;
  }
}
