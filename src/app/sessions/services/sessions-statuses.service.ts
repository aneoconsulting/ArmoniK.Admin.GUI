import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionsStatusesService {
  readonly statuses: Record<SessionStatus, string> = {
    [SessionStatus.SESSION_STATUS_UNSPECIFIED]: $localize`Unspecified`,
    [SessionStatus.SESSION_STATUS_RUNNING]: $localize`Running`,
    [SessionStatus.SESSION_STATUS_CANCELLED]: $localize`Cancelled`,
  };

  statusToLabel(status: SessionStatus): string {
    return this.statuses[status];
  }
}
