import { TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TaskFilterDefinition } from '@app/tasks/types';
import { FieldKey } from '@app/types/data';
import { FilterDefinition } from '@app/types/filter-definition';
import { ListOptions } from '@app/types/options';
import { StorageService } from './storage.service';
import { TableStorageService } from './table-storage.service';
import { TableURLService } from './table-url.service';
import { TableService } from './table.service';

describe('TableService', () => {
  let service: TableService;
  const tableURLMock = {
    getQueryParamsOptions: jest.fn(),
    getQueryParamsFilters: jest.fn()
  };
  const tableStorageMock = {
    save: jest.fn(),
    restore: jest.fn(),
    remove: jest.fn()
  };
  const saveSpy = jest.spyOn(tableStorageMock, 'save');
  const restoreSpy = jest.spyOn(tableStorageMock, 'restore');
  const removeSpy = jest.spyOn(tableStorageMock, 'remove');

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TableService,
        { provide: TableURLService, useValue: tableURLMock},
        { provide: TableStorageService, useValue: tableStorageMock},
        { provide: StorageService, useValue: {} }
      ]
    }).inject(TableService);
  });

  it('should run', () => {
    expect(service).toBeTruthy();
  });

  it('saveInterval should call TableStorageService.save', () => {
    service.saveIntervalValue('applications-interval', 2);
    expect(saveSpy).toHaveBeenCalledWith('applications-interval', 2);
  });

  describe('restoreIntervalValue', () => {

    beforeAll(() => {
      tableStorageMock.restore.mockImplementation((key: string) => {
        const intervalRecord: Record<string, unknown> = {
          'applications-interval': 10,
          'sessions-interval': 'Oops',
          'tasks-interval': '0'
        };
        return intervalRecord[key] ?? null;
      });
    });

    it('Should return the interval value of the specified scope', () => {
      expect(service.restoreIntervalValue('applications-interval')).toEqual(10);
      expect(service.restoreIntervalValue('tasks-interval')).toEqual(0);
    });

    it('Should return null if the interval value has no interval', () => {
      expect(service.restoreIntervalValue('partitions-interval')).toBeNull();
    });

    it('Should return null if the interval value is not a number', () => {
      expect(service.restoreIntervalValue('sessions-interval')).toBeNull();
    });
  });

  test('saveLockColumns should call TableStorageService.save', () => {
    service.saveLockColumns('applications-lock-columns', true);
    expect(saveSpy).toHaveBeenCalledWith('applications-lock-columns', true);
  });

  test('restoreLockColumns should call TableStorageService.retore', () => {
    service.restoreLockColumns('applications-lock-columns');
    expect(restoreSpy).toHaveBeenCalledWith('applications-lock-columns');
  });

  it('saveOptions should call TableStorageService.save', () => {
    service.saveOptions('applications-options', 1);
    expect(saveSpy).toHaveBeenCalledWith('applications-options', 1);
  });

  describe('restoreOptions', () => {

    const defaultOptions = {
      pageIndex: 100,
      pageSize: 75,
      sort: {
        active: 2,
        direction: 'desc'
      }
    } as ListOptions<object>;

    beforeAll(() => {
      tableStorageMock.restore.mockImplementation((key: string) => {
        const optionsRecord: Record<string, unknown> = {
          'applications-options': {
            pageIndex: 0,
            pageSize: 10,
            sort: {
              active: 1,
              direction: 'asc'
            }
          },
          'sessions-options': {
            pageIndex: null,
            pageSize: 10,
            sort: {
              active: 4,
              direction: 'asc'
            }
          },
        };
        return optionsRecord[key] ?? null;
      });
    });

    it('Should return queryParamsOptions values', () => {
      tableURLMock.getQueryParamsOptions.mockImplementation((key: string) => {
        switch(key) {
        case 'pageIndex': return '20';
        case 'pageSize': return '50';
        case 'sortField': return 3 as FieldKey<object>;
        case 'sortDirection': return 'desc';
        default: return null;
        }
      });
      expect(service.restoreOptions('applications-options', defaultOptions)).toEqual({
        pageIndex: 20,
        pageSize: 50,
        sort: {
          active: 3,
          direction: 'desc'
        }
      });
    });

    it('Should return the storageData in case of no queryParams', () => {
      tableURLMock.getQueryParamsOptions.mockImplementation((key: string) => {
        return key === 'pageIndex' ? '30' : null;
      });
      expect(service.restoreOptions('applications-options', defaultOptions)).toEqual({
        pageIndex: 30,
        pageSize: 10,
        sort: {
          active: 1,
          direction: 'asc'
        }
      });
    });

    it('Should return the defaultOptions if both storageData and queryParams are empty', () => {
      tableURLMock.getQueryParamsOptions.mockImplementation((key: string) => {
        switch(key) {
        case 'pageSize': return 'oops';
        default: return null;
        } 
      });
      expect(service.restoreOptions('tasks-options', defaultOptions)).toEqual({
        pageIndex: 100,
        pageSize: 75,
        sort: {
          active: 2,
          direction: 'desc'
        }
      });
    });


    it('should call TableStorageService.save when saving filter', () => {
      service.saveFilters('applications-filters', [[{
        field: 1,
        operator: 0,
        value: 'someData',
        for: 'root'
      }]]);
      expect(saveSpy).toHaveBeenCalledWith('applications-filters', [[{
        field: 1,
        operator: 0,
        value: 'someData',
        for: 'root'
      }]]);
    });
  });

  describe('restoreFilter', () => {
    
    const validFilterDefs: TaskFilterDefinition[] = [{
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
      type: 'string'
    }];
    const invalidFilterDefs: TaskFilterDefinition[] = [{
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT,
      type: 'string'
    }];

    beforeAll(() => {
      tableURLMock.getQueryParamsFilters.mockImplementation((filterDef: FilterDefinition<number, number>[]) => {
        return filterDef === validFilterDefs ? [[
          {
            field: 1,
            operator: 0,
            value: 'someData',
            for: 'root'
          }, 
        ]] : [];
      });
      tableStorageMock.restore.mockImplementation((key: string) => {
        return key === 'applications-filters' ? [[
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
        ]] : null;
      });
    });

    it('should return queryParamsFilter', () => {
      expect(service.restoreFilters('applications-filters', validFilterDefs)).toEqual([[{
        field: 1,
        operator: 0,
        value: 'someData',
        for: 'root'
      }]]);
    });

    it('should return stored filters if there is no QueryParams', () => {
      expect(service.restoreFilters('applications-filters', invalidFilterDefs)).toEqual([[
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
      ]]);
    });

    it('Should return null if there is no queryParams nor stored filters', () => {
      expect(service.restoreFilters('partitions-filters', invalidFilterDefs)).toBeNull();
    });
  });

  it('should call TableStorageService.remove when reseting a filter', () => {
    service.resetFilters('applications-filters');
    expect(removeSpy).toHaveBeenCalledWith('applications-filters');
  });

  it('should call TableStorageService.save when saving columns', () => {
    service.saveColumns('applications-columns', ['name', 'id', 'duration']);
    expect(saveSpy).toHaveBeenCalledWith('applications-columns', ['name', 'id', 'duration']);
  });

  it('should call TableStorageService.restore when restoring columns', () => {
    service.restoreColumns('applications-columns');
    expect(restoreSpy).toHaveBeenCalledWith('applications-columns');
  });

  it('should call TableStorageService.relive when reseting columns', () => {
    service.resetColumns('applications-columns');
    expect(removeSpy).toHaveBeenCalledWith('applications-columns');
  });

  it('should call TableStorageService.save when saving views in logs', () => {
    service.saveViewInLogs('tasks-view-in-logs', 'some-icon', 'the-service-name', 'myUrlTemplate');
    expect(saveSpy).toHaveBeenCalledWith('tasks-view-in-logs', {
      serviceIcon: 'some-icon',
      serviceName: 'the-service-name',
      urlTemplate: 'myUrlTemplate'
    });
  });

  it('should call TableStorageService.restore when restoring columns', () => {
    service.restoreViewInLogs('tasks-view-in-logs');
    expect(restoreSpy).toHaveBeenCalledWith('tasks-view-in-logs');
  });
});