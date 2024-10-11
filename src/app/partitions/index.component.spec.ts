import { FilterStringOperator, PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, CustomColumn } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { of } from 'rxjs';
import { IndexComponent } from './index.component';
import { PartitionsFiltersService } from './services/partitions-filters.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw } from './types';

describe('Partitions Index Component', () => {
  let component: IndexComponent;

  const mockPartitionsGrpcService = {
    cancel$: jest.fn(() => of()),
  };

  const newCustomColumns: CustomColumn[] = ['options.options.FastCompute', 'options.options.NewCustom'];

  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: (): unknown => of(newCustomColumns)
      };
    })
  };

  const mockDashboardIndexService = {
    addLine: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const defaultColumns: ColumnKey<PartitionRaw>[] = ['id', 'actions', 'podMax', 'priority'];
  const defaultOptions: ListOptions<PartitionRaw> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'id',
      direction: 'desc'
    }
  };
  const availableTableColumns: TableColumn<PartitionRaw>[] = [
    {
      name: $localize`ID`,
      key: 'id',
      type: 'link',
      sortable: true,
      link: '/partitions',
    },
    {
      name: $localize`Count`,
      key: 'count',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Actions`,
      key: 'actions',
      type: 'actions',
      sortable: false,
    },
    {
      name: $localize`Parent Partition Ids`,
      key: 'parentPartitionIds',
      sortable: true,
    },
    {
      name: $localize`Priority`,
      key: 'priority',
      sortable: true,
    },
    {
      name: $localize`Pod Max`,
      key: 'podMax',
      sortable: true,
    },
  ];

  const defaultIntervalValue = 10;

  const defaultViewInLogs = {
    serviceIcon: 'icon',
    serviceName: 'service',
    urlTemplate: 'https://localhost:4200/taskId=%taskId',
  };

  const defaultShowFilters = false;

  const mockPartitionsIndexService = {
    restoreViewInLogs: jest.fn(() => defaultViewInLogs),
    saveViewInLogs: jest.fn(),
    restoreIntervalValue: jest.fn(() => defaultIntervalValue),
    saveIntervalValue: jest.fn(),
    restoreColumns: jest.fn(() => defaultColumns),
    saveColumns: jest.fn(),
    availableTableColumns,
    restoreLockColumns: jest.fn(() => false),
    saveLockColumns: jest.fn(),
    restoreOptions: jest.fn(() => defaultOptions),
    saveOptions: jest.fn(),
    resetColumns: jest.fn(() => defaultColumns),
  };

  const mockTaskFiltersService = {
    restoreFilters: jest.fn(() => []),
    saveFilters: jest.fn(),
    resetFilters: jest.fn(() => []),
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn(() => defaultShowFilters),
  };
  
  const mockShareUrlService = {
    generateSharableURL: jest.fn(),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        IconsService,
        AutoRefreshService,
        { provide: PartitionsIndexService, useValue: mockPartitionsIndexService },
        { provide: PartitionsGrpcService, useValue: mockPartitionsGrpcService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: DashboardIndexService, useValue: mockDashboardIndexService },
        { provide: Router, useValue: mockRouter },
        { provide: PartitionsFiltersService, useValue: mockTaskFiltersService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: NotificationService, useValue: mockNotificationService },
      ]
    }).inject(IndexComponent);
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update columns keys', () => {
    component.updateDisplayedColumns();
    expect(component.displayedColumnsKeys).toEqual(defaultColumns);
  });

  describe('initialisation', () => {
    it('should initialise columns', () => {
      expect(component.displayedColumnsKeys).toEqual(defaultColumns);
      expect(component.availableColumns).toEqual(availableTableColumns.map(column => column.key));
      expect(component.displayedColumns).toEqual([
        {
          name: $localize`ID`,
          key: 'id',
          type: 'link',
          sortable: true,
          link: '/partitions',
        },
        {
          name: $localize`Actions`,
          key: 'actions',
          type: 'actions',
          sortable: false,
        },
        {
          name: $localize`Pod Max`,
          key: 'podMax',
          sortable: true,
        },
        {
          name: $localize`Priority`,
          key: 'priority',
          sortable: true,
        },
      ]);
      expect(Object.keys(component.columnsLabels).length).toEqual(availableTableColumns.length);
      expect(component.lockColumns).toEqual(false);
    });

    it('should initialise filters', () => {
      expect(component.filters).toEqual([]);
      expect(component.filters$).toBeDefined();
    });

    it('should init options', () => {
      expect(component.options).toEqual(defaultOptions);
    });

    it('should merge subscriptions', () => {
      expect(component.subscriptions).toBeDefined();
    });
  });

  describe('on destroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.subscriptions.closed).toBeTruthy();
    });
  });

  it('should get icons', () => {
    expect(component.getIcon('refresh')).toEqual('refresh');
  });

  it('should refresh', () => {
    const spy = jest.spyOn(component.refresh$, 'next');
    component.onRefresh();
    expect(spy).toHaveBeenCalled();
  });

  describe('On interval value change', () => {
    it('should update intervalValue', () => {
      component.onIntervalValueChange(5);
      expect(component.intervalValue).toEqual(5);
    });

    it('should update interval observer', () => {
      const spy = jest.spyOn(component.interval, 'next');
      component.onIntervalValueChange(5);
      expect(spy).toHaveBeenCalledWith(5);
    });

    it('should refresh if the value is not null', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onIntervalValueChange(5);
      expect(spy).toHaveBeenCalled();
    });

    it('should stop the interval if the value is 0', () => {
      const spy = jest.spyOn(component.stopInterval, 'next');
      component.onIntervalValueChange(0);
      expect(spy).toHaveBeenCalled();
    });

    it('should save the interval value', () => {
      component.onIntervalValueChange(5);
      expect(mockPartitionsIndexService.saveIntervalValue).toHaveBeenCalledWith(5);
    });
  });

  describe('On columns change', () => {
    const newColumns: ColumnKey<PartitionRaw>[] = ['id', 'count'];
    beforeEach(() => {
      component.onColumnsChange(newColumns);
    });

    it('should update displayed column keys', () => {
      expect(component.displayedColumnsKeys).toEqual(newColumns);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumns()).toEqual([
        {
          name: $localize`ID`,
          key: 'id',
          type: 'link',
          sortable: true,
          link: '/partitions',
        },
        {
          name: $localize`Count`,
          key: 'count',
          type: 'date',
          sortable: true,
        },
      ]);
    });

    it('should save columns', () => {
      expect(mockPartitionsIndexService.saveColumns).toHaveBeenCalledWith(['id', 'count']);
    });
  });

  describe('On Columns Reset', () => {
    beforeEach(() => {
      component.onColumnsReset();
    });

    it('should reset columns', () => {
      expect(component.displayedColumnsKeys).toEqual(defaultColumns);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumns()).toEqual([
        {
          name: $localize`ID`,
          key: 'id',
          type: 'link',
          sortable: true,
          link: '/partitions',
        },
        {
          name: $localize`Actions`,
          key: 'actions',
          type: 'actions',
          sortable: false,
        },
        {
          name: $localize`Pod Max`,
          key: 'podMax',
          sortable: true,
        },
        {
          name: $localize`Priority`,
          key: 'priority',
          sortable: true,
        },
      ]);
    });
  });

  describe('On Filters Change', () => {
    const newFilters: FiltersOr<PartitionRawEnumField> = [
      [
        {
          field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: 'partition id',
          for: 'root',
        }
      ]
    ];

    let filterSpy: jest.SpyInstance;

    beforeEach(() => {
      filterSpy = jest.spyOn(component.filters$, 'next');
      component.onFiltersChange(newFilters);
    });

    it('should update filters', () => {
      expect(component.filters).toEqual(newFilters);
    });

    it('should save filters', () => {
      expect(mockTaskFiltersService.saveFilters).toHaveBeenCalledWith(newFilters);
    });

    it('should update page index', () => {
      expect(component.options.pageIndex).toEqual(0);
    });

    it('should emit filters', () => {
      expect(filterSpy).toHaveBeenCalledWith(newFilters);
    });
  });

  describe('On Filter Reset', () => {
    let filterSpy: jest.SpyInstance;

    beforeEach(() => {
      filterSpy = jest.spyOn(component.filters$, 'next');
      component.onFiltersReset();
    });

    it('should reset filters', () => {
      expect(component.filters).toEqual([]);
    });

    it('should reset page index', () => {
      expect(component.options.pageIndex).toEqual(0);
    });

    it('should emit empty filters', () => {
      expect(filterSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('On lockColumns Change', () => {
    beforeEach(() => {
      component.onLockColumnsChange();
    });

    it('should update lockColumn value', () => {
      expect(component.lockColumns).toBeTruthy();
    });

    it('should save lockColumns', () => {
      expect(mockPartitionsIndexService.saveLockColumns).toHaveBeenCalledWith(true);
    });
  });

  it('should get auto refresh tooltip', () => {
    const tooltip = component.autoRefreshTooltip();
    expect(tooltip).toEqual(`Auto-refresh every ${defaultIntervalValue} seconds`);
  });

  describe('handleAutoRefreshStart', () => {
    it('should start interval if interval value is not 0', () => {
      const spy = jest.spyOn(component.interval, 'next');
      component.handleAutoRefreshStart();
      expect(spy).toHaveBeenCalledWith(component.intervalValue);
    });

    it('should stop interval if interval value is 0', () => {
      const spy = jest.spyOn(component.stopInterval, 'next');
      component.intervalValue = 0;
      component.handleAutoRefreshStart();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Adding table as a line to dashboard', () => {
    it('should add a line', () => {
      component.onAddToDashboard();
      expect(mockDashboardIndexService.addLine).toHaveBeenCalledWith({
        name: 'Partitions',
        type: 'Partitions',
        interval: 10,
        showFilters: false,
        lockColumns: false,
        displayedColumns: defaultColumns,
        options: defaultOptions,
        filters: [],
      });
    });
  });
  
  describe('onShowFiltersChange', () => {
    it('should update show filters', () => {
      const newShowFilters = true;
      component.onShowFiltersChange(newShowFilters);
      expect(component.showFilters).toEqual(newShowFilters);
    });

    it('should save show filters', () => {
      const newShowFilters = true;
      component.onShowFiltersChange(newShowFilters);
      expect(mockTaskFiltersService.saveShowFilters).toHaveBeenCalledWith(newShowFilters);
    });
  });
});