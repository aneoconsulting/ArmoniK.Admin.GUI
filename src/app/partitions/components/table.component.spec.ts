import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FiltersService } from '@services/filters.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { PartitionsTableComponent } from './table.component';
import { PartitionsIndexService } from '../services/partitions-index.service';
import { PartitionRawFiltersOr } from '../types';

describe('ApplicationTableComponent', () => {
  let component: PartitionsTableComponent;

  const mockPartitionsIndexService = {
    isPartitionIdColumn: jest.fn(),
    columnToLabel: jest.fn(),
    isCountColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    saveColumns: jest.fn(),
    isObjectColumn: jest.fn(),
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(),
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

  const filters: PartitionRawFiltersOr = [
    [
      {
        field: 1, 
        for: 'root', 
        operator: 1,
        value: 2
      },
      {
        field: 2,
        for: 'root', // This shouldn't appear as a filter when redirecting on a task since it is not a task filter
        operator: 2,
        value: 'string'
      },
      {
        field: 6,
        for: 'root',
        operator: 0,
        value: 2
      },
    ],
    [
      {
        field: 1, // This shouldn't appear as a filter when redirecting on a task since it already filters on partition id equal something
        for: 'root',
        operator: 0,
        value: 'someValue'
      },
      {
        field: 6,
        for: 'root',
        operator: 2,
        value: 'namespace'
      }
    ]
  ];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        PartitionsTableComponent,
        { provide: PartitionsIndexService, useValue: mockPartitionsIndexService },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
        FiltersService
      ]
    }).inject(PartitionsTableComponent);

    component.displayedColumns = ['id', 'count', 'actions'];
    component.filters = [];
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'id',
        direction: 'desc'
      }
    };
    component.sort = sort;
    component.paginator = paginator;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should restore taskStatus on init', () => {
    component.ngOnInit();
    expect(mockTasksByStatusService.restoreStatuses).toHaveBeenCalledWith('partitions');
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
        active: 'id',
        direction: 'desc'
      }
    });
  });

  it('should return the label of a column', () => {
    component.columnToLabel('id');
    expect(mockPartitionsIndexService.columnToLabel).toHaveBeenCalledWith('id');
  });

  it('should check if a column is a partition Id column', () => {
    component.isPartitionIdColumn('id');
    expect(mockPartitionsIndexService.isPartitionIdColumn).toHaveBeenCalledWith('id');
  });

  it('should check if a column is a count column', () => {
    component.isCountColumn('count');
    expect(mockPartitionsIndexService.isCountColumn).toHaveBeenCalledWith('count');
  });

  it('should check if a column is a simple column', () => {
    component.isSimpleColumn('podMax');
    expect(mockPartitionsIndexService.isSimpleColumn).toHaveBeenCalledWith('podMax');
  });

  it('should check if a column is a sortable column', () => {
    component.isNotSortableColumn('actions');
    expect(mockPartitionsIndexService.isNotSortableColumn).toHaveBeenCalledWith('actions');
  });

  it('should check if a column is an object column', () => {
    component.isObjectColumn('podConfiguration');
    expect(mockPartitionsIndexService.isObjectColumn).toHaveBeenCalledWith('podConfiguration');
  });

  it('should change column order', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<string[]>;
    component.onDrop(event);
    expect(mockPartitionsIndexService.saveColumns).toHaveBeenCalledWith(component.displayedColumns);
    expect(component.displayedColumns).toEqual(['count', 'id', 'actions']);
  });

  it('should count tasks by status of the filters', () => {
    expect(component.countTasksByStatusFilters('bench'))
      .toEqual([[
        {
          for: 'options',
          field: 4,
          value: 'bench',
          operator: 0
        }
      ]]);
  });

  describe('createTasksByStatusQueryParams', () => {
    it('should create query params for the specified application', () => {
      const name = 'bench';
      expect(component.createTasksByStatusQueryParams(name)).toEqual({
        '0-options-4-0': name
      });
    });

    it('should apply all task-related filters', () => {
      component.filters = filters;
      expect(component.createTasksByStatusQueryParams('bench')).toEqual({
        '0-options-4-1': '2',
        '0-options-3-0': '2',
        '0-options-4-0': 'bench',
        '1-options-3-2': 'namespace',
        '1-options-4-0': 'bench'
      });
    });
  });
});