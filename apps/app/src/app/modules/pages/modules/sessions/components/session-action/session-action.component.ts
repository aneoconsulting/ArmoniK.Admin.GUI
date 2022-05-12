import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppError, Session } from '@armonik.admin.gui/armonik-typing';
import { ClrLoadingState } from '@clr/angular';
import { Observable } from 'rxjs';
import { SessionsService } from '../../../../../core/services/http';

@Component({
  selector: 'app-pages-sessions-session-action',
  templateUrl: './session-action.component.html',
  styleUrls: ['./session-action.component.scss'],
})
export class SessionActionComponent {
  @Input() id = '';
  @Input() closed?: boolean;
  @Input() title = '';

  @Output() receivedData = new EventEmitter<Session>();
  @Output() receivedError = new EventEmitter<AppError>();

  private serviceCall?: Observable<Session>;

  clickButtonState: ClrLoadingState = ClrLoadingState.DEFAULT;

  constructor(private sessionsService: SessionsService) {}

  private onError(error: AppError): void {
    this.receivedError.emit(error);
    this.clickButtonState = ClrLoadingState.ERROR;
  }

  private onNext(data: Session): void {
    this.receivedData.emit(data);
    this.clickButtonState = ClrLoadingState.SUCCESS;
  }

  onClick() {
    this.clickButtonState = ClrLoadingState.LOADING;

    if (this.closed) {
      this.serviceCall = this.sessionsService.reopen(this.id);
    } else {
      this.serviceCall = this.sessionsService.close(this.id);
    }
    this.serviceCall.subscribe({
      error: this.onError.bind(this),
      next: this.onNext.bind(this),
    });
  }
}
