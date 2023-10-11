import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TaskStatusColored } from '@app/types/dialog';
import { DataFilterService } from '@app/types/filter-definition';
import { FiltersOr } from '@app/types/filters';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { IndexComponent } from './index.component';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawFilter } from './types';

describe('Application component', () => {

  let component: IndexComponent;

  const dataSample = {
    total: 3,
    applications: [
      {id: 'abc', sessions: [], partitionsId: []},
      {id: 'def', sessions: [], partitionsId: []},
      {id: 'ghi', sessions: [], partitionsId: []},
    ]
  };

  const sampleFiltersOr: FiltersOr<number, null> = [
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
        operator: 1,
        value: 'value'
      }
    ]
  ];

  const options = {
    pageIndex: 1,
    pageSize: 25,
    sort: {
      active: 'sessions',
      direction: 'asc'
    }
  };

  const intervalRefreshSubject = new Subject<number>();

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
  };

  const mockShareUrlService = {
    generateSharableURL: jest.fn()
  };

  const mockApplicationsFilterService = {
    restoreFilters: jest.fn(() => {
      return sampleFiltersOr;
    }),
    saveFilters: jest.fn(),
    resetFilters: jest.fn(),
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(),
    saveStatuses: jest.fn()
  };

  const mockNotificationService = {
    error: jest.fn()
  };

  const mockGrpcApplicationsService = {
    list$: jest.fn()
  };

  const mockAutoRefreshService = {
    autoRefreshTooltip: jest.fn(),
    createInterval: jest.fn(() => intervalRefreshSubject),
  };

  let dialogSubject: BehaviorSubject<TaskStatusColored[] | undefined>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        {provide: TasksByStatusService, useValue: mockTasksByStatusService },
        {provide: NotificationService, useValue: mockNotificationService },
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
        FiltersService,
        DataFilterService,
        { provide: DATA_FILTERS_SERVICE, useValue: mockApplicationsFilterService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ApplicationsIndexService, useValue: mockApplicationIndexService },
        { provide: ApplicationsGrpcService, useValue: mockGrpcApplicationsService },
        { provide: AutoRefreshService, useValue: mockAutoRefreshService },
      ]
    }).inject(IndexComponent);

    component.paginator = {
      pageIndex: 1,
      pageSize: 25,
      page: new Subject<PageEvent>()
    } as unknown as MatPaginator;

    component.sort = new MatSort();
    component.sort.active = 'sessions';
    component.sort.direction = 'asc';
    
    component.ngOnInit();
    component.ngAfterViewInit();

    component.displayedColumns = ['name', 'namespace', 'service', 'version', 'actions', 'count'];
  });
  
  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('should restore on init', () => {
    expect(mockApplicationIndexService.restoreColumns).toHaveBeenCalled();
    expect(mockApplicationIndexService.restoreOptions).toHaveBeenCalled();
    expect(mockApplicationsFilterService.restoreFilters).toHaveBeenCalled();
    expect(mockApplicationIndexService.restoreIntervalValue).toHaveBeenCalled();
    expect(mockShareUrlService.generateSharableURL).toHaveBeenCalledWith(component.options, component.filters);
    expect(mockTasksByStatusService.restoreStatuses).toHaveBeenCalledWith('applications');
    expect(component.availableColumns).toBe(mockApplicationIndexService.availableColumns);
  });

  describe('ngAfterViewInit', () => {
    mockGrpcApplicationsService.list$.mockImplementation(() => {
      return new BehaviorSubject(dataSample);
    });

    describe('on sort change', () => {

      const sort: Sort = {
        active: 'id',
        direction: 'asc'
      };

      it('should reset pageIndex', () => {
        component.sort.sortChange.next(sort);
        expect(component.paginator.pageIndex).toEqual(0);
      });

      it('should load data', () => {
        component.sort.sortChange.next(sort);
        expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
        expect(component.total).toEqual(3);
        expect(component.data).toEqual(dataSample.applications);
      });
    });
  });

  it('should load data on page change', () => {
    component.paginator.page.next({
      pageIndex: 2,
      previousPageIndex: 1,
      pageSize: 25,
      length: 10
    });
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
    expect(component.total).toEqual(3);
    expect(component.data).toEqual(dataSample.applications);
  });

  it('should load data on user refresh', () => {
    component.refresh.next();
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
    expect(component.total).toEqual(3);
    expect(component.data).toEqual(dataSample.applications);
  });

  it('should load data on interval refresh', () => {
    intervalRefreshSubject.next(1);
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
    expect(component.total).toEqual(3);
    expect(component.data).toEqual(dataSample.applications);
  });

  it('should catch the error and have empty data', () => {
    mockGrpcApplicationsService.list$.mockImplementationOnce(() => {
      return throwError(() => new Error('Test error'));
    });

    // To prevent the error to be printed in the console
    const mockConsole = jest.spyOn(console, 'error');
    mockConsole.mockImplementationOnce(() => {});
    
    component.refresh.next();
    expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to fetch applications');
    expect(component.data).toEqual([]);
    expect(component.total).toEqual(0);
  });

  it('should return column labels', () => {
    expect(component.columnsLabels()).toEqual(mockApplicationIndexService.columnsLabels);
  });
  
  it('should return the label of a column', () => {
    component.columnToLabel('name');
    expect(mockApplicationIndexService.columnToLabel).toHaveBeenCalledWith('name');
  });

  it('should check if a column is an action', () => {
    component.isActionsColumn('actions');
    expect(mockApplicationIndexService.isActionsColumn).toHaveBeenCalledWith('actions');
  });

  it('should check if a column is a count column', () => {
    component.isCountColumn('count');
    expect(mockApplicationIndexService.isCountColumn).toHaveBeenCalledWith('count');
  });

  it('should check if a column is a simple column', () => {
    component.isSimpleColumn('name');
    expect(mockApplicationIndexService.isSimpleColumn).toHaveBeenCalledWith('name');
  });

  it('should check if a column is a sortable column', () => {
    component.isNotSortableColumn('actions');
    expect(mockApplicationIndexService.isNotSortableColumn).toHaveBeenCalledWith('actions');
  });

  it('should get page icon', () => {
    expect(component.getPageIcon('applications')).toEqual('apps');
  });

  it('should get required icons', () => {
    expect(component.getIcon('tune')).toEqual('tune');
    expect(component.getIcon('more')).toEqual('more_vert');
    expect(component.getIcon('view')).toEqual('visibility');
  });

  it('should refresh', () => {
    const spyRefresh = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(spyRefresh).toHaveBeenCalled();
  });

  describe('onIntervalValueChange', () => {
    it('should call the application index service', () => {
      component.onIntervalValueChange(1);
      expect(mockApplicationIndexService.saveIntervalValue).toHaveBeenCalled();
    });

    it('should change the interval value', () => {
      const spyRefresh = jest.spyOn(component.interval, 'next');
      component.onIntervalValueChange(10);
      expect(spyRefresh).toHaveBeenCalledWith(10);
    });

    it('should stop the interval value', () => {
      const spyStopRefresh = jest.spyOn(component.stopInterval, 'next');
      component.onIntervalValueChange(0);
      expect(spyStopRefresh).toHaveBeenCalled();
    });
  });

  it('should change columns', () => {
    const newColumns: ApplicationRawColumnKey[] = ['name', 'count', 'service'];
    component.onColumnsChange(newColumns);
    expect(component.displayedColumns).toEqual(newColumns);
    expect(mockApplicationIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  it('should reset columns', () => {
    mockApplicationIndexService.resetColumns.mockImplementationOnce(() => mockApplicationIndexService.availableColumns);
    component.onColumnsReset();
    expect(component.displayedColumns).toEqual(mockApplicationIndexService.availableColumns);
    expect(mockApplicationIndexService.resetColumns).toHaveBeenCalled();
  });

  it('should update filters', () => {
    const newFilterOr: ApplicationRawFilter = [[{
      field: 3,
      for: 'root',
      operator: 4,
      value: 'new value'
    }]];
    const spyRefresh = jest.spyOn(component.refresh, 'next');
    component.onFiltersChange(newFilterOr);
    
    expect(mockApplicationsFilterService.saveFilters).toHaveBeenCalledWith(newFilterOr);
    expect(component.paginator.pageIndex).toEqual(0);
    expect(spyRefresh).toHaveBeenCalled();
    expect(component.filters).toEqual(newFilterOr);
  });

  it('should reset filters', () => {
    mockApplicationsFilterService.resetFilters.mockImplementationOnce(() => []);
    component.onFiltersReset();
    expect(mockApplicationsFilterService.resetFilters).toHaveBeenCalled();
    expect(component.paginator.pageIndex).toEqual(0);
    expect(component.filters).toEqual([]);
  });

  it('should give the tooltip', () => {
    component.intervalValue = 13;
    component.autoRefreshTooltip();
    expect(mockAutoRefreshService.autoRefreshTooltip).toHaveBeenCalledWith(13);
  });

  it('should change column order', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<string[]>;
    component.onDrop(event);
    expect(mockApplicationIndexService.saveColumns).toHaveBeenCalledWith(component.displayedColumns);
    expect(component.displayedColumns).toEqual(['namespace', 'name', 'service', 'version', 'actions', 'count']);
  });

  it('should stop the auto-refresh', () => {
    const spyStopRefresh = jest.spyOn(component.stopInterval, 'next');
    component.intervalValue = 0;
    component.handleAutoRefreshStart();
    expect(spyStopRefresh).toHaveBeenCalled();
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

  it('should create the query params of the tasks by status', () => {
    expect(component.createTasksByStatusQueryParams('name', 'version'))
      .toEqual({
        ['0-options-5-0']: 'name',
        ['0-options-6-0']: 'version'
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