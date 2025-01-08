import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusLabelColor, StatusService } from '@app/types/status';

@Injectable()
export class SessionsStatusesService extends StatusService<SessionStatus> {
  readonly statuses: Record<SessionStatus, StatusLabelColor> = {
    [SessionStatus.SESSION_STATUS_UNSPECIFIED]: {
      label: $localize`Unspecified`,
      color: '#696969',
    },
    [SessionStatus.SESSION_STATUS_RUNNING]: {
      label: $localize`Running`,
      color: '#008000',
      icon: 'play',
    },
    [SessionStatus.SESSION_STATUS_CANCELLED]: {
      label: $localize`Cancelled`,
      color: '#0E4D92',
      icon: 'cancel',
    },
    [SessionStatus.SESSION_STATUS_CLOSED]: {
      label: $localize`Closed`,
      color: '#FF0000',
      icon: 'close',
    },
    [SessionStatus.SESSION_STATUS_DELETED]: {
      label: $localize`Deleted`,
      color: '#000000',
      icon: 'delete',
    },
    [SessionStatus.SESSION_STATUS_PURGED]: {
      label: $localize`Purged`,
      color: '#800080',
      icon: 'purge',
    },
    [SessionStatus.SESSION_STATUS_PAUSED]: {
      label: $localize`Paused`,
      color: '#FF8C00',
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
