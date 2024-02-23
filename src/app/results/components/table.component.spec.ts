import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableColumn } from '@app/types/column.type';
import { FiltersService } from '@services/filters.service';
import { ResultsTableComponent } from './table.component';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';
import { ResultRawColumnKey } from '../types';

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

  const sort: MatSort = {
    active: 'namespace',
    direction: 'asc',
    sortChange: new EventEmitter()
  } as unknown as MatSort;

  const paginator: MatPaginator = {
    pageIndex: 2,
    pageSize: 50,
    page: new EventEmitter()
  } as unknown as MatPaginator;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsTableComponent,
        { provide: ResultsIndexService, useValue: mockResultsIndexService },
        FiltersService,
        ResultsStatusesService
      ]
    }).inject(ResultsTableComponent);

    component.displayedColumns = displayedColumns;
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'name',
        direction: 'desc'
      }
    };
    component.sort = sort;
    component.paginator = paginator;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update options sort on sort change', () => {
    component.ngAfterViewInit();
    sort.sortChange.emit();
    expect(component.options.sort).toEqual({
      active: sort.active,
      direction: sort.direction
    });
  });

  it('should update options pagination on page change', () => {
    component.ngAfterViewInit();
    paginator.page.emit();
    expect(component.options).toEqual({
      pageIndex: paginator.pageIndex,
      pageSize: paginator.pageSize,
      sort: {
        active: 'name',
        direction: 'desc'
      }
    });
  });

  it('should change column order', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<string[]>;
    component.onDrop(event);
    expect(mockResultsIndexService.saveColumns).toHaveBeenCalledWith(component.displayedColumns.map(column => column.key));
    expect(component.displayedColumns).toEqual(displayedColumns);
  });

  it('should get the session filter for a result', () => {
    expect(component.createSessionIdQueryParams('12345')).toEqual({
      '1-root-1-0':'12345'
    });
  });
});