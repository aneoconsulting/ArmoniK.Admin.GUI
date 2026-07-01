import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { StatusService } from '@app/types/status';

@Injectable()
export class SessionsStatusesService extends StatusService<SessionStatus> {
  constructor() {
    super('sessions');
  }

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
