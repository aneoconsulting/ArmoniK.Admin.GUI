import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { ResultsTableComponent } from './table.component';
import { ResultsGrpcService } from '../services/results-grpc.service';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRawColumnKey, ResultRawFilters } from '../types';

describe('ApplicationTableComponent', () => {
  let component: ResultsTableComponent;

  const displayedColumns: TableColumn<ResultRawColumnKey>[] = [
    {
      name: 'Completed at',
      key: 'completedAt',
      type: 'date',
      sortable: true
    },
    {
      name: 'Name',
      key: 'name',
      sortable: true
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false
    }
  ];

  const mockResultsIndexService = {
    columnToLabel: jest.fn(),
    isSessionIdColumn: jest.fn(),
    isDateColumn: jest.fn(),
    isStatusColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    saveColumns: jest.fn(),
    isResultIdColumn: jest.fn()
  };

  const mockResultsGrpcService = {
    list$: jest.fn(() => of({results: [{resultId: '1'}, {resultId: '2'}]}))
  };

  const mockNotificationService = {
    error: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsTableComponent,
        { provide: ResultsIndexService, useValue: mockResultsIndexService },
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        FiltersService,
        ResultsStatusesService
      ]
    }).inject(ResultsTableComponent);
    component.refresh$ = new Subject();
    component.loading$ = new Subject();
    component.displayedColumns = displayedColumns;
    component.filters$ = new BehaviorSubject<ResultRawFilters>([]);
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'name',
        direction: 'desc'
      }
    };
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update data on next', () => {
    component.refresh$.next();
    expect(component.data).toEqual([
      {
        raw: {
          resultId: '1'
        },
        value$: expect.any(Subject)
      },
      {
        raw: {
          resultId: '2'
        },
        value$: expect.any(Subject)
      }
    ]);
  });

  it('should change column order', () => {
    const newColumns: ResultRawColumnKey[] = ['actions', 'name', 'completedAt'];
    component.onDrop(newColumns);
    expect(mockResultsIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
    expect(component.displayedColumns).toEqual(displayedColumns);
  });

  it('should get the session filter for a result', () => {
    expect(component.createSessionIdQueryParams('12345')).toEqual({
      '1-root-1-0':'12345'
    });
  });
});