import { ResultRawEnumField, ListResultsResponse } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { of, throwError } from 'rxjs';
import ResultsDataService from './results-data.service';
import { ResultRaw } from '../types';
import { ResultsGrpcService } from './results-grpc.service';

describe('ResultsDataService', () => {
  let service: ResultsDataService;

  const cachedResults = { results: [{ resultId: 'result1' }, { resultId: 'result2' }], total: 2 }  as unknown as ListResultsResponse;
  const mockCacheService = {
    get: jest.fn(() => cachedResults),
    save: jest.fn(),
  };

  const results = { results: [{ resultId: 'result1' }, { resultId: 'result2' }, { resultId: 'result3' }], total: 3 } as unknown as ListResultsResponse;
  const mockResultsGrpcService = {
    list$: jest.fn(() => of(results)),
  };

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  const initialOptions: ListOptions<ResultRaw> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'desc'
    }
  };

  const initialFilters: FiltersOr<ResultRawEnumField> = [];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ResultsDataService,
        FiltersService,
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: CacheService, useValue: mockCacheService },
      ]
    }).inject(ResultsDataService);
    service.options = initialOptions;
    service.filters = initialFilters;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load data from the cache', () => {
      expect(service.data).toEqual([
        {
          raw: {
            resultId: 'result1'
          }
        },
        {
          raw: {
            resultId: 'result2'
          }
        },
      ]);
    });

    it('should set the total cached data', () => {
      expect(service.total).toEqual(cachedResults.total);
    });
  });

  describe('Fetching data', () => {
    it('should list the data', () => {
      service.refresh$.next();
      expect(mockResultsGrpcService.list$).toHaveBeenCalledWith(service.options, service.filters);
    });

    it('should update the total', () => {
      service.refresh$.next();
      expect(service.total).toEqual(results.total);
    });

    it('should update the data', () => {
      service.refresh$.next();
      expect(service.data).toEqual([
        {
          raw: {
            resultId: 'result1'
          }
        },
        {
          raw: {
            resultId: 'result2'
          }
        },
        {
          raw: {
            resultId: 'result3'
          }
        }
      ]);
    });

    it('should handle an empty DataRaw', () => {
      const emptyResults = { results: undefined, total: 0 } as unknown as ListResultsResponse;
      mockResultsGrpcService.list$.mockReturnValueOnce(of(emptyResults));
      service.refresh$.next();
      expect(service.data).toEqual([]);
    });

    it('should catch errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockResultsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should notify errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockResultsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should cache the raw data', () => {
      service.refresh$.next();
      expect(mockCacheService.save).toHaveBeenCalledWith(service.scope, results);
    });
  });

  it('should display a success message', () => {
    const message = 'A success message !';
    service.success(message);
    expect(mockNotificationService.success).toHaveBeenCalledWith(message);
  });

  it('should display a warning message', () => {
    const message = 'A warning message !';
    service.warning(message);
    expect(mockNotificationService.warning).toHaveBeenCalledWith(message);
  });

  it('should display an error message', () => {
    const error: GrpcStatusEvent = {
      statusMessage: 'A error status message'
    } as GrpcStatusEvent;
    jest.spyOn(console, 'error').mockImplementation(() => {});
    service.error(error);
    expect(mockNotificationService.error).toHaveBeenCalledWith(error.statusMessage);
  });

  it('should load correctly', () => {
    expect(service.loading).toBeFalsy();
  });
});