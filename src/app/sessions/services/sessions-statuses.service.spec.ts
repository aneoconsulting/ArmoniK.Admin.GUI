import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { SessionsStatusesService } from './sessions-statuses.service';

describe('SessionsStatusesService', () => {
  const service = new SessionsStatusesService();

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the correct label', () => {
    expect(service.statusToLabel(SessionStatus.SESSION_STATUS_RUNNING)).toBe('Running');
  });

  describe('canCancel', () => {
    it('should return true if the session can be cancelled', () => {
      expect(service.canCancel(SessionStatus.SESSION_STATUS_RUNNING)).toBe(true);
    });

    it('should return false if the session cannot be cancelled', () => {
      expect(service.canCancel(SessionStatus.SESSION_STATUS_CLOSED)).toBe(false);
    });
  });

  describe('canPause', () => {
    it('should return true if the session can be paused', () => {
      expect(service.canPause(SessionStatus.SESSION_STATUS_RUNNING)).toBe(true);
    });

    it('should return false if the session cannot be paused', () => {
      expect(service.canPause(SessionStatus.SESSION_STATUS_CLOSED)).toBe(false);
    });
  });

  describe('canResume', () => {
    it('should return true if the session can be resumed', () => {
      expect(service.canResume(SessionStatus.SESSION_STATUS_PAUSED)).toBe(true);
    });

    it('should return false if the session cannot be resumed', () => {
      expect(service.canResume(SessionStatus.SESSION_STATUS_RUNNING)).toBe(false);
    });
  });

  describe('canClose', () => {
    it('should return true if the session can be closed', () => {
      expect(service.canClose(SessionStatus.SESSION_STATUS_RUNNING)).toBe(true);
    });

    it('should return false if the session cannot be closed', () => {
      expect(service.canClose(SessionStatus.SESSION_STATUS_CLOSED)).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should return true if the session can be deleted', () => {
      expect(service.canDelete(SessionStatus.SESSION_STATUS_PURGED)).toBe(true);
    });

    it('should return false if the session cannot be deleted', () => {
      expect(service.canDelete(SessionStatus.SESSION_STATUS_DELETED)).toBe(false);
    });
  });
});