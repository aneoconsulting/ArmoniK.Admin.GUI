import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { StatusLabelColor } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';
import { SessionsStatusesService } from './sessions-statuses.service';

describe('SessionsStatusesService', () => {
  let service: SessionsStatusesService;
  
  const mockDefaultStatuses = {
    [SessionStatus.SESSION_STATUS_CANCELLED]: {
      color: 'red',
      label: 'Cancelled'
    }
  };

  const mockDefaultConfigService = {
    exportedDefaultConfig: {
      'sessions-statuses': mockDefaultStatuses,
    },
  };

  const mockStoredStatuses = {
    [SessionStatus.SESSION_STATUS_CANCELLED]: {
      color: 'blue',
      label: 'Cancelled'
    }
  };

  const mockStorageService = {
    getItem: jest.fn((): unknown => mockStoredStatuses),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        SessionsStatusesService,
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
        { provide: StorageService, useValue: mockStorageService },
      ]
    }).inject(SessionsStatusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    beforeEach(() => {
      mockStorageService.getItem.mockReturnValueOnce(null);
    });

    it('should init the statuses with stored config', () => {
      expect(service.statuses).toEqual(mockStoredStatuses);
    });

    it('should init the statuses with default config', () => {
      const serviceWithDefault = TestBed.inject(SessionsStatusesService);
      expect(serviceWithDefault.statuses).toEqual(mockDefaultStatuses);
    });
  });

  describe('updateStatuses', () => {
    const newStatuses = {
      [SessionStatus.SESSION_STATUS_CANCELLED]: {
        label: 'Cancelled',
        color: 'green',
      }
    } as Record<SessionStatus, StatusLabelColor>;

    beforeEach(() => {
      service.updateStatuses(newStatuses);
    });

    it('should update the statuses', () => {
      expect(service.statuses[SessionStatus.SESSION_STATUS_CANCELLED]).toEqual(newStatuses[SessionStatus.SESSION_STATUS_CANCELLED]);
    });

    it('should store the new statuses', () => {
      expect(mockStorageService.setItem).toHaveBeenCalledWith('sessions-statuses', service.statuses);
    });
  });

  it('should retrieve the default statuses config', () => {
    expect(service.getDefault()).toEqual(mockDefaultConfigService.exportedDefaultConfig['sessions-statuses']);
  });

  it('should return the correct label', () => {
    expect(service.statusToLabel(SessionStatus.SESSION_STATUS_CANCELLED)).toBeDefined();
  });

  describe('canCancel', () => {
    it('should return true if the session can be cancelled', () => {
      expect(service.canCancel(SessionStatus.SESSION_STATUS_RUNNING)).toBe(true);
    });

    it('should return false if the session cannot be cancelled', () => {
      expect(service.canCancel(SessionStatus.SESSION_STATUS_CLOSED)).toBe(false);
    });
  });

  describe('canPurge', () => {
    it('should return true if the session can be purged', () => {
      expect(service.canPurge(SessionStatus.SESSION_STATUS_CLOSED)).toBe(true);
    });

    it('should return false if the session cannot be purged', () => {
      expect(service.canPurge(SessionStatus.SESSION_STATUS_RUNNING)).toBe(false);
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