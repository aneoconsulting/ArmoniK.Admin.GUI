import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '@armonik.admin.gui/armonik-typing';
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

  @Output() data = new EventEmitter<Session>();

  private serviceCall?: Observable<Session>;

  clickButtonState: ClrLoadingState = ClrLoadingState.DEFAULT;

  constructor(private sessionsService: SessionsService) {}

  private onError(): void {
    this.clickButtonState = ClrLoadingState.ERROR;
  }

  private onNext(data: Session): void {
    this.data.emit(data);
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
