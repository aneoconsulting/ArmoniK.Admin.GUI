import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionsStatusesService {
  readonly statuses: Record<SessionStatus, string> = {
    [SessionStatus.SESSION_STATUS_UNSPECIFIED]: $localize`Unspecified`,
    [SessionStatus.SESSION_STATUS_RUNNING]: $localize`Running`,
    [SessionStatus.SESSION_STATUS_CANCELLED]: $localize`Cancelled`,
    [SessionStatus.SESSION_STATUS_CLOSED]: $localize`Closed`,
    [SessionStatus.SESSION_STATUS_DELETED]: $localize`Deleted`,
    [SessionStatus.SESSION_STATUS_PURGED]: $localize`Purged`,
    [SessionStatus.SESSION_STATUS_PAUSED]: $localize`Paused`,
  };

  statusToLabel(status: SessionStatus): string {
    return this.statuses[status];
  }

  sessionNotEnded(status: SessionStatus) {
    return status !== SessionStatus.SESSION_STATUS_RUNNING;
  }
}
