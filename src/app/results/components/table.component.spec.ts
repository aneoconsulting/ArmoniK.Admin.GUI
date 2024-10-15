import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, ResultData } from '@app/types/data';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { ResultsTableComponent } from './table.component';
import { ResultsGrpcService } from '../services/results-grpc.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw, ResultRawFilters } from '../types';

describe('TasksTableComponent', () => {
  let component: ResultsTableComponent;

  const displayedColumns: TableColumn<ResultRaw>[] = [
    {
      name: 'Result ID',
      key: 'resultId',
      type: 'link',
      sortable: true,
      link: '/tasks',
    },
    {
      name: 'Status',
      key: 'status',
      type: 'status',
      sortable: true,
    },
    {
      name: 'Created at',
      key: 'createdAt',
      type: 'date',
      sortable: true,
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false,
    }
  ];

  const mockResultsIndexService = {
    isActionsColumn: jest.fn(),
    isTaskIdColumn: jest.fn(),
    isStatusColumn: jest.fn(),
    isDateColumn: jest.fn(),
    isDurationColumn: jest.fn(),
    isObjectColumn: jest.fn(),
    isSelectColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    columnToLabel: jest.fn(),
    saveColumns: jest.fn(),
    saveOptions: jest.fn(),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const results = { results: [{ resultId: 'result1' }, { resultId: 'result2' }, { resultId: 'result3' }], total: 3 };
  const mockResultsGrpcService = {
    list$: jest.fn(() => of(results)),
    cancel$: jest.fn(() => of({})),
  };

  const cachedResults = { results: [{ resultId: 'result1' }, { resultId: 'result2' }], total: 2 };
  const mockCacheService = {
    get: jest.fn(() => cachedResults),
    save: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsTableComponent,
        { provide: ResultsIndexService, useValue: mockResultsIndexService },
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
        ResultsStatusesService,
        FiltersService,
        { provide: CacheService, useValue: mockCacheService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
      ]
    }).inject(ResultsTableComponent);

    component.displayedColumns = displayedColumns;
    component.filters$ = new BehaviorSubject<ResultRawFilters>([]);
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'resultId',
        direction: 'desc'
      }
    };
    component.refresh$ = new Subject();
    component.loading = signal(false);
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load cached data', () => {
      expect(mockCacheService.get).toHaveBeenCalled();
    });
  });

  describe('loadFromCache', () => {
    beforeEach(() => {
      component.loadFromCache();
    });

    it('should update total data with cached one', () => {
      expect(component.total).toEqual(cachedResults.total);
    });

    it('should update data with cached one', () => {
      expect(component.data()).toEqual([
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
  });

  it('should update data on refresh', () => {
    component.refresh$.next();
    expect(component.data()).toEqual([
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

  it('should cache received data', () => {
    component.refresh$.next();
    expect(mockCacheService.get).toHaveBeenCalled();
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });

  describe('on list error', () => {
    beforeEach(() => {
      mockResultsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
    });

    it('should log error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      component.refresh$.next();
      expect(spy).toHaveBeenCalled();
    });

    it('should send a notification', () => {
      component.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should send empty data', () => {
      component.refresh$.next();
      expect(component.data()).toEqual([]);
    });
  });

  describe('options changes', () => {
    it('should refresh data', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onOptionsChange();
      expect(spy).toHaveBeenCalled();
    });

    it('should save options', () => {
      component.onOptionsChange();
      expect(mockResultsIndexService.saveOptions).toHaveBeenCalled();
    });
  });

  test('onDrop should call ResultsIndexService', () => {
    const newColumns: ColumnKey<ResultRaw>[] = ['actions', 'resultId', 'status'];
    component.onDrop(newColumns);
    expect(mockResultsIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  test('createSessionIdQueryParams should return query params with correct session', () => {
    const sessionId = 'session1';
    const result = component.createSessionIdQueryParams(sessionId);
    expect(result).toEqual({
      '1-root-1-0': sessionId
    });
  });

  describe('isDataRawEqual', () => {
    it('should return true if two resultRaws are the same', () => {
      const result1 = { resultId: 'result' } as ResultRaw;
      const result2 = {...result1} as ResultRaw;
      expect(component.isDataRawEqual(result1, result2)).toBeTruthy();
    });

    it('should return false if two resultRaws are differents', () => {
      const result1 = { resultId: 'result' } as ResultRaw;
      const result2 = { resultId: 'result1' } as ResultRaw;
      expect(component.isDataRawEqual(result1, result2)).toBeFalsy();
    });
  });

  it('should track a result by its id', () => {
    const result = {raw: { resultId: 'result' }} as ResultData;
    expect(component.trackBy(0, result)).toEqual(result.raw.resultId);
  });
});