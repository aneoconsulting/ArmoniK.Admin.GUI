import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusesServiceI } from '@app/types/services';

@Injectable()
export class SessionsStatusesService implements StatusesServiceI<SessionStatus> {
  readonly statuses: Record<SessionStatus, string> = {
    [SessionStatus.SESSION_STATUS_UNSPECIFIED]: $localize`Unspecified`,
    [SessionStatus.SESSION_STATUS_RUNNING]: $localize`Running`,
    [SessionStatus.SESSION_STATUS_CANCELLED]: $localize`Cancelled`,
  };

  statusToLabel(status: SessionStatus): string {
    return this.statuses[status];
  }

  notEnded(status: SessionStatus) {
    return status !== SessionStatus.SESSION_STATUS_RUNNING;
  }
}
