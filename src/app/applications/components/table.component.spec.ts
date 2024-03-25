import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { TaskStatusColored } from '@app/types/dialog';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationsTableComponent } from './table.component';
import { ApplicationsIndexService } from '../services/applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawFilters } from '../types';

describe('ApplicationTableComponent', () => {
  let component: ApplicationsTableComponent;

  const displayedColumns: TableColumn<ApplicationRawColumnKey>[] = [
    {
      name: 'Name',
      key: 'name',
      sortable: true
    },
    {
      name: 'Namespace',
      key: 'namespace',
      sortable: true
    },
    {
      name: 'Service',
      key: 'service',
      sortable: true
    },
    {
      name: 'Version',
      key: 'version',
      sortable: true
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false
    },
    {
      name: 'Tasks by Status',
      key: 'count',
      type: 'count',
      sortable: true
    }
  ];

  const mockApplicationIndexService = {
    availableColumns: ['name', 'namespace', 'service', 'version', 'actions', 'count'],
    columnsLabels: {
      name: $localize`Name`,
      namespace: $localize`Namespace`,
      service: $localize`Service`,
      version: $localize`Version`,
      count: $localize`Tasks by Status`,
      actions: $localize`Actions`,
    },
    restoreColumns: jest.fn(),
    saveColumns: jest.fn(),
    resetColumns: jest.fn(),
    columnToLabel: jest.fn(),
    isActionsColumn: jest.fn(),
    isCountColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    restoreOptions: jest.fn(),
    restoreIntervalValue: jest.fn(),
    saveIntervalValue: jest.fn(),
    saveOptions: jest.fn(),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn()
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(),
    saveStatuses: jest.fn()
  };

  let dialogSubject: BehaviorSubject<TaskStatusColored[] | undefined>;

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

  const filters: ApplicationRawFilters = [
    [
      {
        field: 1,
        for: 'root',
        operator: 1,
        value: 2
      },
      {
        field: 2,
        for: 'root',
        operator: 2,
        value: 'string'
      },
      {
        field: 1,
        for: 'root',
        operator: 0, // This shouldn't appear as a filter when redirecting on a task since it is the application name
        value: 2
      },
    ],
    [
      {
        field: 4,
        for: 'root',
        operator: 3,
        value: 'someValue'
      },
      {
        field: 3,
        for: 'root',
        operator: 2,
        value: 'namespace'
      }
    ]
  ];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsTableComponent,
        { provide: ApplicationsIndexService, useValue: mockApplicationIndexService },
        {provide: TasksByStatusService, useValue: mockTasksByStatusService },
        {provide: MatDialog, useValue:
          {
            open: () => {
              return {
                afterClosed: () => {
                  return dialogSubject;
                }
              };
            }
          }
        },
        IconsService,
        FiltersService
      ]
    }).inject(ApplicationsTableComponent);

    component.displayedColumns = displayedColumns;
    component.filters = [];
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

  it('should restore taskStatus on init', () => {
    component.ngOnInit();
    expect(mockTasksByStatusService.restoreStatuses).toHaveBeenCalledWith('applications');
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

  it('should get required icons', () => {
    expect(component.getIcon('tune')).toEqual('tune');
    expect(component.getIcon('more')).toEqual('more_vert');
    expect(component.getIcon('view')).toEqual('visibility');
  });

  it('should change column order', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<string[]>;
    component.onDrop(event);
    expect(mockApplicationIndexService.saveColumns).toHaveBeenCalledWith(displayedColumns.map(column => column.key));
    expect(component.displayedColumns).toEqual(displayedColumns);
  });

  it('should count tasks by status of the filters', () => {
    expect(component.countTasksByStatusFilters('unified_api', '1.0.0'))
      .toEqual([[
        {
          for: 'options',
          field: 5,
          value: 'unified_api',
          operator: 0
        },
        {
          for: 'options',
          field: 6,
          value: '1.0.0',
          operator: 0
        }
      ]]);
  });

  describe('createTasksByStatusQueryParams', () => {

    const name = 'Application 1';
    const version = '1.0.0';

    it('should create query params for the specified application', () => {
      expect(component.createTasksByStatusQueryParams(name, version)).toEqual({
        '0-options-5-0': name,
        '0-options-6-0': version
      });
    });

    it('should create query params for the specified application and applied filters', () => {
      component.filters = filters;
      expect(component.createTasksByStatusQueryParams(name, version)).toEqual({
        '0-options-5-0': name,
        '0-options-6-0': version,
        '0-options-5-1': '2',
        '0-options-6-2': 'string',
        '1-options-5-0': name,
        '1-options-6-0': version,
        '1-options-8-3': 'someValue',
        '1-options-7-2': 'namespace'
      });
    });
  });

  it('should create the query params to view sessions', () => {
    expect(component.createViewSessionsQueryParams('name', 'version'))
      .toEqual({
        ['0-options-5-0']: 'name',
        ['0-options-6-0']: 'version'
      });
  });

  it('should permit to personalize tasks by status', () => {
    dialogSubject = new BehaviorSubject<TaskStatusColored[] | undefined>([{
      color: 'green',
      status: TaskStatus.TASK_STATUS_COMPLETED
    }]);
    component.personalizeTasksByStatus();
    expect(component.tasksStatusesColored).toEqual([{
      color: 'green',
      status: TaskStatus.TASK_STATUS_COMPLETED
    }]);
    expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalled();
  });

  it('should not personalize if there is no result', () => {
    dialogSubject = new BehaviorSubject<TaskStatusColored[] | undefined>(undefined);
    component.personalizeTasksByStatus();
    expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledTimes(0);
  });
});