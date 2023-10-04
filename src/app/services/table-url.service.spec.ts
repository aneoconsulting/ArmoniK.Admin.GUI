import { TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TaskFilterDefinition } from '@app/tasks/types';
import { TableURLService } from './table-url.service';

describe('TableURLService', () => {
  
  let service: TableURLService;
  const mockActivatedRoute = {
    snapshot: {
      queryParamMap: {
        keys: [
          '1-root-1-0',
          '1-root-16-0',
          '0-root-13-0',
          'nextAreIncorrects',
          '2--12-0',
          '0-root-13-',
          '-root-13-0',
          '0-root--0',
          'nextHasNoDefinition',
          '2-root-3-1'
        ],
        get: jest.fn()
      }
    }
  };
  const filterDefs: TaskFilterDefinition[] = [
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
      type: 'string'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_HOSTNAME,
      type: 'string'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_TTL,
      type: 'string'
    }
  ];
  const consoleLogSpy = jest.spyOn(console, 'log');
  consoleLogSpy.mockImplementation(); 

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TableURLService,
        {provide: ActivatedRoute, useValue: mockActivatedRoute}
      ]
    }).inject(TableURLService);

    mockActivatedRoute.snapshot.queryParamMap.get.mockImplementation((key: string) => {
      const queryParamMap: Record<string, unknown> = {
        'pageIndex': 1,
        '1-root-1-0': 'someData',
        '1-root-16-0': 'anotherKindOfData',
        '0-root-13-0': 'stillData',
        '2--12-0': 'yetAgainData',
        'thisOneHas': '{unparsable:data}'
      };
      
      return queryParamMap[key] ?? null;
    });
  });

  it('Should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getQueryParamsOptions', () => {
    it('Should return the paramsOptions', () => {
      expect(service.getQueryParamsOptions('pageIndex')).toEqual(1);
    });
    it('Should return null if the parameter is empty', () => {
      expect(service.getQueryParamsOptions('sortDirection')).toBeNull();
    });
  });

  describe('getQueryParamsFilters', () => {
    it('should return a FiltersOr of 3 filters', () => {
      const result = [[
        {
          field: 1,
          operator: 0,
          value: 'someData',
          for: 'root'
        }, 
        {
          field: 16,
          operator: 0,
          value: 'anotherKindOfData',
          for: 'root'
        }
      ], [
        {
          field: 13,
          operator: 0,
          value: 'stillData',
          for: 'root'
        }]];
      expect(service.getQueryParamsFilters(filterDefs)).toEqual(result);
    });

    it('Should print logs in the console in case of incorrect definition', () => {
      service.getQueryParamsFilters(filterDefs);
      expect(consoleLogSpy).toHaveBeenCalledWith('Unknown filter', 3);
    });
  });

  describe('getQueryParam', () => {
    it('should parse the parse parameter is set to true', () => {
      expect(service.getQueryParam('pageIndex')).toEqual(1);
    });
  
    it('should throw SyntaxError when the data is not parsable', () => {
      expect(() => {service.getQueryParam('thisOneHas');}).toThrow(SyntaxError);
    });
  });  
});