import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { StatusLabelColor } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';
import { ResultsStatusesService } from './results-statuses.service';

describe('ResultsStatusService', () => {
  let service: ResultsStatusesService;

  const mockDefaultStatuses = {
    [ResultStatus.RESULT_STATUS_ABORTED]: {
      color: 'red',
      label: 'Aborted'
    }
  };

  const mockDefaultConfigService = {
    exportedDefaultConfig: {
      'results-statuses': mockDefaultStatuses,
    },
  };

  const mockStoredStatuses = {
    [ResultStatus.RESULT_STATUS_ABORTED]: {
      color: 'blue',
      label: 'Aborted'
    }
  };

  const mockStorageService = {
    getItem: jest.fn((): unknown => mockStoredStatuses),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ResultsStatusesService,
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
        { provide: StorageService, useValue: mockStorageService },
      ]
    }).inject(ResultsStatusesService);
  });

  it('should create', () => {
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
      const serviceWithDefault = TestBed.inject(ResultsStatusesService);
      expect(serviceWithDefault.statuses).toEqual(mockDefaultStatuses);
    });
  });

  describe('updateStatuses', () => {
    const newStatuses = {
      [ResultStatus.RESULT_STATUS_ABORTED]: {
        label: 'Aborted',
        color: 'green',
      }
    } as Record<ResultStatus, StatusLabelColor>;

    beforeEach(() => {
      service.updateStatuses(newStatuses);
    });

    it('should update the statuses', () => {
      expect(service.statuses[ResultStatus.RESULT_STATUS_ABORTED]).toEqual(newStatuses[ResultStatus.RESULT_STATUS_ABORTED]);
    });

    it('should store the new statuses', () => {
      expect(mockStorageService.setItem).toHaveBeenCalledWith('results-statuses', service.statuses);
    });
  });

  it('should retrieve the default statuses config', () => {
    expect(service.getDefault()).toEqual(mockDefaultConfigService.exportedDefaultConfig['results-statuses']);
  });

  it('should return the correct status label', () => {
    expect(service.statusToLabel(ResultStatus.RESULT_STATUS_ABORTED)).toBeDefined();
  });
});