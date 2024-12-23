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
      icon: 'play',
    },
    [SessionStatus.SESSION_STATUS_CANCELLED]: {
      label: $localize`Cancelled`,
      color: '#0E4D92',
      icon: 'cancel',
    },
    [SessionStatus.SESSION_STATUS_CLOSED]: {
      label: $localize`Closed`,
      color: 'red',
      icon: 'close',
    },
    [SessionStatus.SESSION_STATUS_DELETED]: {
      label: $localize`Deleted`,
      color: 'black',
      icon: 'delete',
    },
    [SessionStatus.SESSION_STATUS_PURGED]: {
      label: $localize`Purged`,
      color: 'purple',
      icon: 'purge',
    },
    [SessionStatus.SESSION_STATUS_PAUSED]: {
      label: $localize`Paused`,
      color: 'darkorange',
      icon: 'pause',
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
