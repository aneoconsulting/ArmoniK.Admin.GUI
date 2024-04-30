import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { ResultsTableComponent } from './table.component';
import { ResultsGrpcService } from '../services/results-grpc.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRawColumnKey, ResultRawFilters } from '../types';

describe('TasksTableComponent', () => {
  let component: ResultsTableComponent;

  const displayedColumns: TableColumn<ResultRawColumnKey>[] = [
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
    saveColumns: jest.fn()
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const mockResultsGrpcService = {
    list$: jest.fn(() => of({ results: [{ resultId: 'result1' }, { resultId: 'result2' }, { resultId: 'result3' }], total: 3 })),
    cancel$: jest.fn(() => of({})),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsTableComponent,
        { provide: ResultsIndexService, useValue: mockResultsIndexService },
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
        ResultsStatusesService,
        FiltersService,
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
    component.loading$ = new Subject();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update data on refresh', () => {
    component.refresh$.next();
    expect(component.data).toEqual([
      {
        raw: {
          resultId: 'result1'
        },
        value$: expect.any(Subject)
      },
      {
        raw: {
          resultId: 'result2'
        },
        value$: expect.any(Subject)
      },
      {
        raw: {
          resultId: 'result3'
        },
        value$: expect.any(Subject)
      }
    ]);
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
      expect(component.data).toEqual([]);
    });
  });

  it('should refresh data on options changes', () => {
    const spy = jest.spyOn(component.refresh$, 'next');
    component.onOptionsChange();
    expect(spy).toHaveBeenCalled();
  });

  test('onDrop should call ResultsIndexService', () => {
    const newColumns: ResultRawColumnKey[] = ['actions', 'resultId', 'status'];
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
});