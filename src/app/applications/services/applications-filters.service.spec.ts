import { ApplicationRawEnumField, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FilterFor } from '@app/types/filter-definition';
import { FiltersOr } from '@app/types/filters';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersCacheService } from '@services/filters-cache.service';
import { TableService } from '@services/table.service';
import { ApplicationsFiltersService } from './applications-filters.service';
import { ApplicationRawFilters, ApplicationsFiltersDefinition } from '../types';

describe('ApplicationsFiltersService', () => {
  let service: ApplicationsFiltersService;

  const showFilters = false;

  const mockTableService = {
    saveFilters: jest.fn(),
    restoreFilters: jest.fn(),
    resetFilters: jest.fn(),
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn((): boolean | null => showFilters),
  };

  const defaultFilterDefinition: ApplicationsFiltersDefinition[] = [
    {
      for: 'root',
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
      type: 'string',
    },
    {
      for: 'root',
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
      type: 'string',
    },
    {
      for: 'root',
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
      type: 'string',
    },
    {
      for: 'root',
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
      type: 'string',
    }
  ];

  const cachedFilters: FiltersOr<ApplicationRawEnumField> = [[
    {
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
      for: 'root',
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
      value: 'name'
    }
  ]];

  const mockFiltersCacheService = {
    get: jest.fn(() => cachedFilters),
  };

  const defaultFilters: ApplicationRawFilters = new DefaultConfigService().defaultApplications.filters;

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ApplicationsFiltersService,
        DefaultConfigService,
        { provide: TableService, useValue: mockTableService },
        { provide: FiltersCacheService, useValue: mockFiltersCacheService },
      ]
    }).inject(ApplicationsFiltersService);
  });

  it('should create', () => {
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

  it('should save filters', () => {
    const filters: ApplicationRawFilters = [[
      {
        field: 0,
        for: 'root',
        operator: 1,
        value: 1
      }
    ]];
    service.saveFilters(filters);
    expect(mockTableService.saveFilters).toHaveBeenCalledWith('applications-filters', filters);
  });

  it('should restore filters', () => {
    service.restoreFilters();
    expect(mockTableService.restoreFilters).toHaveBeenCalledWith('applications-filters', defaultFilterDefinition);
  });

  it('should restore default filters if it cannot restore', () => {
    mockTableService.restoreFilters.mockImplementationOnce(() => null);
    expect(service.restoreFilters()).toEqual(defaultFilters);
  });

  it('should reset filters', () => {
    service.resetFilters();
    expect(mockTableService.resetFilters).toHaveBeenCalledWith('applications-filters');
  });

  it('should return default filters on reset', () => {
    expect(service.resetFilters()).toEqual(defaultFilters);
  });

  it('should return filters definitions', () => {
    expect(service.filtersDefinitions).toEqual(defaultFilterDefinition);
  });

  it('should save showFilters', () => {
    service.saveShowFilters(true);
    expect(mockTableService.saveShowFilters).toHaveBeenCalledWith('applications-show-filters', true);
  });

  describe('restoreShowFilters', () => {
    it('should restore showFilters', () => {
      expect(service.restoreShowFilters()).toBe(showFilters);
    });

    it('should restore default showFilters if it cannot restore', () => {
      mockTableService.restoreShowFilters.mockReturnValueOnce(null);
      expect(service.restoreShowFilters()).toBe(true);
    });
  });

  describe('retrieveLabel', () => {
    it('should retrieve label', () => {
      expect(service.retrieveLabel('root', ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME)).toEqual('Name');
    });
  
    it('should not retrieve label in case of options property', () => {
      expect(() => {service.retrieveLabel('options', ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME);})
        .toThrow('Impossible case');
    });

    it('should throw an error in case of an unknown filter for', () => {
      expect(() => service.retrieveLabel('unexisting' as FilterFor<ApplicationRawEnumField, null>, ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME))
        .toThrow('Unknown filter type: unexisting 1');
    });
  });

  it('should return filter definitions', () => {
    expect(service.retrieveFiltersDefinitions()).toEqual(service.filtersDefinitions);
  });

  it('should retrieve the field', () => {
    expect(service.retrieveField('Namespace')).toEqual({for: 'root', index: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE});
  });
});