import { SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SessionsDataService } from '@app/sessions/services/sessions-data.service';
import { SessionsIndexService } from '@app/sessions/services/sessions-index.service';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, CustomColumn } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { of } from 'rxjs';
import { SessionsLineComponent } from './sessions-line.component';
import { TableLine } from '../../types';

describe('SessionsLineComponent', () => {
  let component: SessionsLineComponent;

  const defaultConfigService = new DefaultConfigService();

  const defaultColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['sessionId', 'count'];
  const customColumns: CustomColumn[] = ['options.options.FastCompute'];

  const displayedColumns: TableColumn<SessionRaw, TaskOptions>[] = [
    {
      key: 'sessionId',
      name: 'ID',
      type: 'link',
      link: '/sessions/',
      sortable: true
    },
    {
      key: 'deletedAt',
      name: 'Parent Session IDs',
      type: 'object',
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
    },
    {
      name: $localize`Select`,
      key: 'select',
      type: 'select',
      sortable: false,
    },
  ];

  const options: ListOptions<SessionRaw, TaskOptions> = {
    pageIndex: 0,
    pageSize: 5,
    sort: {
      active: 'sessionId',
      direction: 'desc',
    },
  };

  const line: TableLine<SessionRaw, TaskOptions> = {
    name: 'Tasks',
    type: 'Sessions',
    displayedColumns: displayedColumns.map(c => c.key),
    filters: [],
    interval: 20,
    options: options,
    showFilters: false,
  };

  const nameLine = {
    name: 'NewNameLine'
  };
  const mockMatDialog = {
    open: jest.fn((): unknown => {
      return {
        afterClosed() {
          return of(nameLine);
        }
      };
    }),
  };

  const mockSessionsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [] as FiltersOr<SessionRawEnumField>,
    refresh$: {
      next: jest.fn()
    },
  };

  const mockSessionsIndexService = {
    availableTableColumns: displayedColumns,
    defaultColumns: defaultColumns,
    resetColumns: jest.fn(() => new DefaultConfigService().defaultSessions.columns),
    restoreColumns: jest.fn(() => ['name', 'count']),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SessionsLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        AutoRefreshService,
        IconsService,
        { provide: SessionsDataService, useValue: mockSessionsDataService },
        { provide: SessionsIndexService, useValue: mockSessionsIndexService },
        DefaultConfigService,
        { provide: NotificationService, useValue: mockNotificationService },
      ]
    }).inject(SessionsLineComponent);
    component.line = line;
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should load properly', () => {
    expect(component.loading).toEqual(mockSessionsDataService.loading);
  });

  describe('on init', () => {
    it('should init with line values', () => {
      const intervalSpy = jest.spyOn(component.interval, 'next');
      component.ngOnInit();
      expect(component.filters).toBe(line.filters);
      expect(intervalSpy).toHaveBeenCalledWith(line.interval);
    });

    it('should init with default values', () => {
      component.line = {
        ...line,
        displayedColumns: undefined,
        interval: undefined as unknown as number,
        options: undefined,
      };
      component.ngOnInit();
      expect(component.displayedColumnsKeys).toEqual(defaultColumns);
      expect(component.intervalValue).toEqual(10);
      expect(component.options).toEqual(defaultConfigService.defaultSessions.options);
      expect(component.showFilters).toEqual(line.showFilters);
    });
  });

  it('should unsubscribe on destroy', () => {
    const subSpy = jest.spyOn(component.subscriptions, 'unsubscribe');
    component.ngOnDestroy();
    expect(subSpy).toHaveBeenCalled();
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

  it('should get icon', () => {
    expect(component.getIcon('tune')).toEqual('tune');
  });

  it('should generate an autoRefresh tooltip', () => {
    expect(component.autoRefreshTooltip()).toEqual(`Auto-refresh every ${line.interval} seconds`);
  });

  it('should refresh', () => {
    component.refresh();
    expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
  });

  describe('On Options Change', () => {
    beforeEach(() => {
      component.onOptionsChange();
    });

    it('should save options', () => {
      expect(component.line.options).toEqual(mockSessionsDataService.options);
    });

    it('should refresh', () => {
      expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
    });
  });

  describe('onIntervalValueChange', () => {
    it('should change interval line value', () => {
      component.onIntervalValueChange(5);
      expect(component.line.interval).toEqual(5);
    });

    it('should emit on interval change', () => {
      const lineSpy = jest.spyOn(component.lineChange, 'emit');
      component.onIntervalValueChange(5);
      expect(lineSpy).toHaveBeenCalled();
    });

    it('should change interval value with new value', () => {
      const spyInterval = jest.spyOn(component.interval, 'next');
      component.onIntervalValueChange(5);
      expect(spyInterval).toHaveBeenCalledWith(5);
    });

    it('should stop interval when the value is 0', () => {
      const spyStopInterval = jest.spyOn(component.stopInterval, 'next');
      component.onIntervalValueChange(0);
      expect(spyStopInterval).toHaveBeenCalled();
    });
  });

  it('should emit on edit name line', () => {
    const spy = jest.spyOn(component.lineChange, 'emit');
    component.onEditNameLine();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit on delete line', () => {
    const spy = jest.spyOn(component.lineDelete, 'emit');
    component.onDeleteLine();
    expect(spy).toHaveBeenCalledWith(component.line);
  });

  describe('onFilterChange', () => {
    const newFilters: FiltersOr<SessionRawEnumField, TaskOptionEnumField> = [[{for: 'root', field: 0, operator: 1, value: 2}]];

    it('should update applied filters', () => {
      component.onFiltersChange(newFilters);
      expect(component.filters).toEqual(newFilters);
    });

    it('should update line filters', () => {
      component.onFiltersChange(newFilters);
      expect(component.line.filters).toEqual(newFilters);
    });

    it('should emit', () => {
      const lineSpy = jest.spyOn(component.lineChange, 'emit');
      component.onFiltersChange(newFilters);
      expect(lineSpy).toHaveBeenCalled();
    });

    it('should refresh', () => {
      component.refresh();
      expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
    });
  
    describe('On Options Change', () => {
      beforeEach(() => {
        component.onOptionsChange();
      });
  
      it('should save options', () => {
        expect(component.line.options).toEqual(mockSessionsDataService.options);
      });
  
      it('should refresh', () => {
        expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
      });
    });
  
  });

  describe('OnColumnsChange', () => {
    const newColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['sessionId', 'count', 'duration', 'select'];

    beforeEach(() => {
      component.displayedColumnsKeys = ['count', 'id'] as ColumnKey<SessionRaw, TaskOptions>[];
      component.line.displayedColumns = ['sessionId', 'options.maxDuration'] as ColumnKey<SessionRaw, TaskOptions>[];
    });

    it('should change displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.displayedColumnsKeys).toEqual(['select', 'sessionId', 'count', 'duration']);
    });

    it('should change line displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.line.displayedColumns).toEqual(['select', 'sessionId', 'count', 'duration']);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onColumnsChange(['select', 'sessionId', 'count', 'duration']);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onColumnsReset', () => {
    beforeEach(() => {
      component.displayedColumnsKeys = ['sessionId', 'createdAt'] as ColumnKey<SessionRaw, TaskOptions>[];
      component.line.displayedColumns = ['closedAt', 'options'] as ColumnKey<SessionRaw, TaskOptions>[];
    });

    it('should reset to default columns', () => {
      component.onColumnsReset();
      expect(component.displayedColumnsKeys).toEqual(defaultColumns);
    });

    it('should reset line displayedColumns', () => {
      component.onColumnsReset();
      expect(component.line.displayedColumns).toEqual(defaultColumns);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onColumnsReset();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onFiltersReset', () => {

    beforeEach(() => {
      mockSessionsDataService.filters = [[{ field: 1, for: 'root', operator: 1, value: 2 }]];
      component.line.filters = [[{ field: 1, for: 'root', operator: 1, value: 2 }]];
    });

    it('should reset filters', () => {
      component.onFiltersReset();
      expect(component.filters).toEqual([]);
    });

    it('should reset line filters', () => {
      component.onFiltersReset();
      expect(component.line.filters).toEqual([]);
    });

    it('should emit', () => {
      const lineSpy = jest.spyOn(component.lineChange, 'emit');
      component.onFiltersReset();
      expect(lineSpy).toHaveBeenCalled();
    });

    it('should refresh', () => {
      component.refresh();
      expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
    });
  
    describe('On Options Change', () => {
      beforeEach(() => {
        component.onOptionsChange();
      });
  
      it('should save options', () => {
        expect(component.line.options).toEqual(mockSessionsDataService.options);
      });
  
      it('should refresh', () => {
        expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
      });
    });
  
  });

  describe('onLockColumnChange', () => {
    beforeEach(() => {
      component.lockColumns = true;
      component.line.lockColumns = true;
    });

    it('should toggle lockColumns', () => {
      component.onLockColumnsChange();
      expect(component.lockColumns).toBeFalsy();
    });

    it('should toggle line lockColumns', () => {
      component.onLockColumnsChange();
      expect(component.line.lockColumns).toBeFalsy();
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onLockColumnsChange();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('addCustomColumn', () => {
    const newCustom: CustomColumn[] = ['options.options.newColumn'];

    beforeEach(() => {
      mockMatDialog.open.mockReturnValueOnce({
        afterClosed() {
          return of(newCustom);
        }
      });
      component.customColumns = customColumns;
      component.availableColumns = [...defaultColumns, ...customColumns];
      component.addCustomColumn();
    });

    it('should update custom columns', () => {
      expect(component.customColumns).toEqual(newCustom);
    });

    it('should update available columns', () => {
      expect(component.availableColumns).toEqual([...defaultColumns, ...newCustom]);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumnsKeys).toEqual([...defaultColumns, 'options.options.newColumn']);
    });

    it('should update line displayed columns', () => {
      expect(component.line.displayedColumns).toEqual([...defaultColumns, 'options.options.newColumn']);
    });

    it('should update line custom columns', () => {
      expect(component.line.customColumns).toEqual(newCustom);
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
      expect(component.line.showFilters).toEqual(newShowFilters);
    });
  });
});