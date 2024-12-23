import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusService } from '@app/types/status';

@Injectable()
export class SessionsStatusesService extends StatusService<SessionStatus> {
  readonly statuses: Record<SessionStatus, string> = {
    [SessionStatus.SESSION_STATUS_UNSPECIFIED]: $localize`Unspecified`,
    [SessionStatus.SESSION_STATUS_RUNNING]: $localize`Running`,
    [SessionStatus.SESSION_STATUS_CANCELLED]: $localize`Cancelled`,
    [SessionStatus.SESSION_STATUS_CLOSED]: $localize`Closed`,
    [SessionStatus.SESSION_STATUS_DELETED]: $localize`Deleted`,
    [SessionStatus.SESSION_STATUS_PURGED]: $localize`Purged`,
    [SessionStatus.SESSION_STATUS_PAUSED]: $localize`Paused`,
  };

  canCancel(status: SessionStatus): boolean {
    return status === SessionStatus.SESSION_STATUS_RUNNING || status === SessionStatus.SESSION_STATUS_PAUSED;
  }

  canPause(status: SessionStatus): boolean {
    return status === SessionStatus.SESSION_STATUS_RUNNING;
  }

  canResume(status: SessionStatus): boolean {
    return status === SessionStatus.SESSION_STATUS_PAUSED;
  }

  canClose(status: SessionStatus): boolean {
    return status === SessionStatus.SESSION_STATUS_RUNNING || status === SessionStatus.SESSION_STATUS_PAUSED;
  }

  canDelete(status: SessionStatus): boolean {
    return status !== SessionStatus.SESSION_STATUS_DELETED;
  }

  canPurge(status: SessionStatus): boolean {
    return status === SessionStatus.SESSION_STATUS_CANCELLED || status === SessionStatus.SESSION_STATUS_CLOSED;
  }
}
