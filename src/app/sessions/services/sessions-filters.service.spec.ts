import { SessionRawEnumField, SessionTaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { SessionsFiltersService } from './sessions-filters.service';
import { SessionsStatusesService } from './sessions-statuses.service';
import { SessionFilterDefinition, SessionRawFiltersOr } from '../types';

describe('SessionsFiltersService', () => {
  let service: SessionsFiltersService;

  const mockTableService = {
    saveFilters: jest.fn(),
    restoreFilters: jest.fn(),
    resetFilters: jest.fn()
  };

  const testFiltersOr: SessionRawFiltersOr = [[
    {
      field: 1,
      for: 'root',
      operator: 0,
      value: 1
    }
  ]];

  const filtersDefinitions: SessionFilterDefinition[] = [
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
      type: 'array',
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
      type: 'status',
      statuses: [
        {
          key: '0',
          value: 'Unspecified',
        },
        {
          key: '1',
          value: 'Running'
        },
        {
          key: '2',
          value: 'Cancelled'
        }
      ],
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT,
      type: 'date'
    },
    {  
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_SERVICE,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_ENGINE_TYPE,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY,
      type: 'number'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES,
      type: 'number'
    }
  ];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        SessionsFiltersService,
        SessionsStatusesService,
        DefaultConfigService,
        { provide: TableService, useValue: mockTableService }
      ]
    }).inject(SessionsFiltersService);
  });

  it('should run', () => {
    expect(service).toBeTruthy();
  });

  it('should save filters', () => {
    service.saveFilters([]);
    expect(mockTableService.saveFilters).toHaveBeenCalledWith('sessions-filters', []);
  });

  it('should restore filters', () => {
    mockTableService.restoreFilters.mockImplementationOnce(() => testFiltersOr);
    expect(service.restoreFilters()).toEqual(testFiltersOr);
  });

  it('should reset filters', () => {
    service.resetFilters();
    expect(mockTableService.resetFilters).toHaveBeenCalledWith('sessions-filters');
  });

  it('should return default filters on reset', () => {
    expect(service.resetFilters()).toEqual(new DefaultConfigService().defaultSessions.filters);
  });

  it('should retrieve filtersDefinitions', () => {
    expect(service.retrieveFiltersDefinitions()).toEqual(filtersDefinitions);
  });

  it('should retrieve labels for a root filter', () => {
    expect(service.retrieveLabel('root', 1)).toEqual('Session Id');
  });

  it('should retrieve labels for an option filter', () => {
    expect(service.retrieveLabel('options', 1)).toEqual('Max Duration');
  });
});