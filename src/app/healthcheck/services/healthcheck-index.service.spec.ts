import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';
import { HealthCheckIndexService } from './healthcheck-index.service';

describe('HealthCheckIndexService', () => {
  let service: HealthCheckIndexService;

  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn()
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        HealthCheckIndexService,
        DefaultConfigService,
        { provide: StorageService, useValue: mockStorageService }
      ]
    }).inject(HealthCheckIndexService);
  });

  it('should exists', () => {
    expect(service).toBeTruthy();
  });

  it('should save interval value', () => {
    service.saveIntervalValue(2);
    expect(mockStorageService.setItem).toHaveBeenCalledWith('healthcheck-interval', 2);
  });

  describe('restoreIntervalValue', () => {
    it('should return the value if it exists', () => {
      mockStorageService.getItem.mockImplementationOnce(() => 5);
      expect(service.restoreIntervalValue()).toEqual(5);
    });

    it('should return default value if none is stored', () => {
      const defaultInterval = (new DefaultConfigService()).healthCheck.interval;
      expect(service.restoreIntervalValue()).toEqual(defaultInterval);
    });

    it('should return default value if the stored value is not a number', () => {
      mockStorageService.getItem.mockImplementationOnce(() => 'notANumber');
      const defaultInterval = (new DefaultConfigService()).healthCheck.interval;
      expect(service.restoreIntervalValue()).toEqual(defaultInterval);
    });
  });
});