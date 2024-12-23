import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusLabelColor, StatusService } from '@app/types/status';

@Injectable()
export class SessionsStatusesService extends StatusService<SessionStatus> {
  readonly statuses: Record<SessionStatus, StatusLabelColor> = {
    [SessionStatus.SESSION_STATUS_UNSPECIFIED]: {
      label: $localize`Unspecified`,
      color: 'grey',
    },
    [SessionStatus.SESSION_STATUS_RUNNING]: {
      label: $localize`Running`,
      color: 'green',
    },
    [SessionStatus.SESSION_STATUS_CANCELLED]: {
      label: $localize`Cancelled`,
      color: 'blue',
    },
    [SessionStatus.SESSION_STATUS_CLOSED]: {
      label: $localize`Closed`,
      color: 'red',
    },
    [SessionStatus.SESSION_STATUS_DELETED]: {
      label: $localize`Deleted`,
      color: 'black',
    },
    [SessionStatus.SESSION_STATUS_PURGED]: {
      label: $localize`Purged`,
      color: 'purple',
    },
    [SessionStatus.SESSION_STATUS_PAUSED]: {
      label: $localize`Paused`,
      color: 'yellow',
    },
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
