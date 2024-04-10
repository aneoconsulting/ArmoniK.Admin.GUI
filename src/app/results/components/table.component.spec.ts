import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { FiltersService } from '@services/filters.service';
import { ResultsTableComponent } from './table.component';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRaw, ResultRawColumnKey } from '../types';

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

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsTableComponent,
        { provide: ResultsIndexService, useValue: mockResultsIndexService },
        FiltersService,
        ResultsStatusesService
      ]
    }).inject(ResultsTableComponent);
    component.data$ = new Subject();
    component.displayedColumns = displayedColumns;
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
    const newData = [{resultId: '1'}, {resultId: '2'}] as unknown as ResultRaw[];
    component.data$.next(newData);
    expect(component.data.map(d => d.raw)).toEqual(newData);
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