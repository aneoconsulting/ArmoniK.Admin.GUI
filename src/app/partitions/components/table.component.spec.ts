import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { PartitionsTableComponent } from './table.component';
import { PartitionsIndexService } from '../services/partitions-index.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFilters } from '../types';

describe('PartitionsTableComponent', () => {
  let component: PartitionsTableComponent;

  const displayedColumns: TableColumn<PartitionRawColumnKey>[] = [
    {
      name: 'Count',
      key: 'count',
      type: 'count',
      sortable: true
    },
    {
      name: 'Pod Reserved',
      key: 'podReserved',
      type: 'link',
      sortable: true,
      link: '/partitions',
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false
    }
  ];

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
    saveStatuses: jest.fn(),
  };

  const filters: PartitionRawFilters = [
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

  const dialogResult = 'color';
  const mockMatDialog = {
    open: () => {
      return {
        afterClosed() {
          return of(dialogResult);
        }
      };
    }
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        PartitionsTableComponent,
        { provide: PartitionsIndexService, useValue: mockPartitionsIndexService },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
        FiltersService,
        {provide: MatDialog, useValue: mockMatDialog},
        IconsService
      ]
    }).inject(PartitionsTableComponent);
    component.data$ = new Subject();
    component.displayedColumns = displayedColumns;
    component.filters = [];
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'id',
        direction: 'desc'
      }
    };
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update data on next', () => {
    const newData = [{id: '1'}, {id: '2'}] as unknown as PartitionRaw[];
    component.data$.next(newData);
    expect(component.data.map(d => d.raw)).toEqual(newData);
  });

  it('should restore taskStatus on init', () => {
    expect(mockTasksByStatusService.restoreStatuses).toHaveBeenCalledWith('partitions');
  });

  it('should change column order', () => {
    const newColumns: PartitionRawColumnKey[] = ['actions', 'id', 'parentPartitionIds'];
    component.onDrop(newColumns);
    expect(mockPartitionsIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
    expect(component.displayedColumns).toEqual(displayedColumns);
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

  it('should personalize tasks by status', () => {
    component.personalizeTasksByStatus();
    expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith('partitions', dialogResult);
  });

  it('should get required icons', () => {
    expect(component.getIcon('tune')).toEqual('tune');
  });
});