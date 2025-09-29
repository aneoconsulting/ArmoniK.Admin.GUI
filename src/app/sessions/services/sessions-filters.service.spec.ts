import { FilterDateOperator, SessionRawEnumField, SessionStatus, SessionTaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { StatusService } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersCacheService } from '@services/filters-cache.service';
import { TableService } from '@services/table.service';
import { SessionsFiltersService } from './sessions-filters.service';
import { SessionRawFilters } from '../types';

describe('SessionsFilterService', () => {
  let service: SessionsFiltersService;

  const mockTableService = {
    saveFilters: jest.fn(),
    resetFilters: jest.fn(),
    restoreFilters: jest.fn(),
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn((): boolean | null => showFilters),
  };

  const sessionFilter: SessionRawFilters = [[{
    field: 1,
    for: 'root',
    operator: 1,
    value: 'Dummy'
  }]];

  const showFilters = false;

  const cachedFilters: FiltersOr<SessionRawEnumField, SessionTaskOptionEnumField> = [[{
    field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT,
    for: 'root',
    operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER,
    value: '1'
  }]];

  const mockFiltersCacheService = {
    get: jest.fn(() => cachedFilters),
  };

  const mockStatusService = {
    statuses: {
      [SessionStatus.SESSION_STATUS_CANCELLED]: {
        label: 'Cancelled',
      },
      [SessionStatus.SESSION_STATUS_CLOSED]: {
        label: 'Closed'
      },
    },
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        SessionsFiltersService,
        DefaultConfigService,
        { provide: StatusService, useValue: mockStatusService },
        { provide: TableService, useValue: mockTableService },
        { provide: FiltersCacheService, useValue: mockFiltersCacheService },
      ]
    }).inject(SessionsFiltersService);
  });

  test('the service must create SessionsFilterService', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should get filters from the filterCache', () => {
      expect(mockFiltersCacheService.get).toHaveBeenCalledWith(service['scope']);
    });

    it('should save the cached filters if they exist', () => {
      expect(mockTableService.saveFilters).toHaveBeenCalledWith(`${service['scope']}-filters`, cachedFilters);
    });
  });

  test('the service must call saveFilters from Table Service', () => {
    service.saveFilters(sessionFilter);
    expect(mockTableService.saveFilters).toHaveBeenCalledWith('sessions-filters', sessionFilter);
  });

  test('the service must call restoreFilters from Table Service', () => {
    service.restoreFilters();
    expect(mockTableService.restoreFilters).toHaveBeenCalledWith('sessions-filters', service.filtersDefinitions);
  });

  test('the service must call resetFilters from Table Service', () => {
    const mockDefaultFilters = new DefaultConfigService().defaultSessions.filters;
    const result = service.resetFilters();
    expect(mockTableService.resetFilters).toHaveBeenCalledWith('sessions-filters');
    expect(result).toEqual(mockDefaultFilters);
  });

  it('should save showFilters', () => {
    service.saveShowFilters(true);
    expect(mockTableService.saveShowFilters).toHaveBeenCalledWith('sessions-show-filters', true);
  });

  describe('restoreShowFilters', () => {
    it('should restore showFilters', () => {
      expect(service.restoreShowFilters()).toBe(showFilters);
    });

    it('should restore default showFilters if it cannot restore', () => {
      mockTableService.restoreShowFilters.mockReturnValueOnce(null);
      expect(service.restoreShowFilters()).toBeTruthy();
    });
  });

  test('the service must return filtersDefinitions', () => {
    expect(service.retrieveFiltersDefinitions()).toEqual(service.filtersDefinitions);
  });

  describe('retrieveLabel', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error');
      consoleSpy.mockImplementationOnce(() => {});
    });

    it('should return the right label with filterFor root', () => {
      expect(service.retrieveLabel('root', SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID)).toEqual('Session ID');
    });

    it('should return the right label with filterFor options', () => {
      expect(service.retrieveLabel('options', SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE)).toEqual('Application Namespace');
    });

    it('should return an empty string when filterFor is unknown', () => {
      const field = SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID;
      const _for = 'custom';
      expect(service.retrieveLabel(_for, field)).toEqual('');
    });

    it('should log an error when filterFor is unknown', () => {
      const field = SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID;
      const _for = 'custom';
      service.retrieveLabel(_for, field);
      expect(consoleSpy).toHaveBeenCalledWith(`Unknown filter type: ${_for} ${field}`);
    });
  });
});