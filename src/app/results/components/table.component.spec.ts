import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { FiltersService } from '@services/filters.service';
import { ResultsTableComponent } from './table.component';
import { ResultsIndexService } from '../services/results-index.service';
import { ResultsStatusesService } from '../services/results-statuses.service';

describe('ApplicationTableComponent', () => {
  let component: ResultsTableComponent;

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

    component.displayedColumns = ['name', 'completedAt', 'actions'];
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

  it('should return the label of a column', () => {
    component.columnToLabel('name');
    expect(mockResultsIndexService.columnToLabel).toHaveBeenCalledWith('name');
  });

  it('should check if a column is a resultId column', () => {
    component.isResultIdColumn('resultId');
    expect(mockResultsIndexService.isResultIdColumn).toHaveBeenCalledWith('resultId');
  });

  it('should check if a column is sessionId', () => {
    component.isSessionIdColumn('sessionId');
    expect(mockResultsIndexService.isSessionIdColumn).toHaveBeenCalledWith('sessionId');
  });

  it('should check if a column is a date column', () => {
    component.isDateColumn('createdAt');
    expect(mockResultsIndexService.isDateColumn).toHaveBeenCalledWith('createdAt');
  });

  it('should check if a column is a simple column', () => {
    component.isSimpleColumn('name');
    expect(mockResultsIndexService.isSimpleColumn).toHaveBeenCalledWith('name');
  });

  it('should check if a column is a status column', () => {
    component.isStatusColumn('status');
    expect(mockResultsIndexService.isStatusColumn).toHaveBeenCalledWith('status');
  });

  it('should change column order', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<string[]>;
    component.onDrop(event);
    expect(mockResultsIndexService.saveColumns).toHaveBeenCalledWith(component.displayedColumns);
    expect(component.displayedColumns).toEqual(['completedAt', 'name', 'actions']);
  });

  describe('prettyDate', () => {
    it('should turn a timestamp to a date', () => {
      const time = {
        toDate: jest.fn()
      } as unknown as Timestamp;

      component.prettyDate(time);
      expect(time.toDate).toHaveBeenCalled();
    });

    it('should return the date', () => {
      const time = {
        toDate: () => 'mocked date'
      } as unknown as Timestamp;
      expect(component.prettyDate(time)).toEqual('mocked date');
    });

    it('should return null if there is no date', () => {
      expect(component.prettyDate(undefined)).toEqual(null);
    });
  });

  it('should get status label', () => {
    expect(component.statusToLabel(ResultStatus.RESULT_STATUS_COMPLETED)).toEqual('Completed');
  });

  it('should get the session filter for a result', () => {
    expect(component.createSessionIdQueryParams('12345')).toEqual({
      '1-root-1-0':'12345'
    });
  });
});