import { Component, Input } from '@angular/core';
import { AppError } from '@armonik.admin.gui/armonik-typing';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pages-sessions-session-errors',
  templateUrl: './session-errors.component.html',
  styleUrls: ['./session-errors.component.scss'],
})
export class SessionErrorsComponent {
  @Input() errors: AppError[] = [];

  constructor(private translateService: TranslateService) {}

  getErrorTranslation(error: AppError): string {
    return this.translateService.instant('sessions.errors.' + error.status, {
      value: error.id,
      name: error.operation,
    });
  }

  trackByError(index: number, error: AppError): number {
    return index + error.status;
  }
}
