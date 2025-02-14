import { ApplicationRawEnumField, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import ApplicationsDataService from '@app/applications/services/applications-data.service';
import { ApplicationsIndexService } from '@app/applications/services/applications-index.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFieldKey, ApplicationRawListOptions } from '@app/applications/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey } from '@app/types/data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { GroupConditions } from '@app/types/groups';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { of } from 'rxjs';
import { ApplicationsLineComponent } from './applications-line.component';
import { TableLine } from '../../types';

describe('ApplicationsLineComponent', () => {
  let component: ApplicationsLineComponent;

  const defaultConfigService = new DefaultConfigService();

  const defaultColumns: ColumnKey<ApplicationRaw>[] = ['name', 'count'];

  const displayedColumns: TableColumn<ApplicationRaw>[] = [
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
    },
    {
      name: $localize`Select`,
      key: 'select',
      type: 'select',
      sortable: false,
    },
  ];

  const options: ApplicationRawListOptions = {
    pageIndex: 0,
    pageSize: 5,
    sort: {
      active: 'name' as ApplicationRawFieldKey,
      direction: 'desc',
    },
  };

  const lineGroup: GroupConditions<ApplicationRawEnumField> = {
    name: 'Group 1',
    conditions: [[{
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
      for: 'root',
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
      value: 'name'
    }]],
  };

  const line: TableLine<ApplicationRaw> = {
    name: 'Tasks',
    type: 'Applications',
    displayedColumns: displayedColumns.map(c => c.key),
    filters: [],
    interval: 20,
    options: options,
    showFilters: false,
    groups: lineGroup as unknown as GroupConditions<FiltersEnums, FiltersOptionsEnums>[],
  };

  const nameLine = {
    name: 'NewNameLine'
  };
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed(): unknown {
          return of(nameLine);
        }
      };
    }),
  };

  const mockApplicationsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [] as FiltersOr<ApplicationRawEnumField>,
    refresh$: {
      next: jest.fn()
    },
    initGroups: jest.fn(),
    manageGroupDialogResult: jest.fn(),
    groupsConditions: [],
    groups: [],
  };

  const mockApplicationsIndexService = {
    availableTableColumns: displayedColumns,
    defaultColumns: defaultColumns,
    resetColumns: jest.fn(() => new DefaultConfigService().defaultApplications.columns),
    restoreColumns: jest.fn(() => ['name', 'count']),
  };

  const mockNotificationService = {
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: ApplicationsDataService, useValue: mockApplicationsDataService },
        AutoRefreshService,
        IconsService,
        { provide: ApplicationsIndexService, useValue: mockApplicationsIndexService },
        DefaultConfigService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ViewContainerRef, usevalue: {} },
      ]
    }).inject(ApplicationsLineComponent);
    component.line = line;
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should load properly', () => {
    expect(component.loading).toEqual(mockApplicationsDataService.loading);
  });

  describe('on init', () => {
    it('should init with line values', () => {
      const intervalSpy = jest.spyOn(component.interval, 'next');
      component.ngOnInit();
      expect(component.filters).toBe(line.filters);
      expect(intervalSpy).toHaveBeenCalledWith(line.interval);
      expect(component.showFilters).toEqual(line.showFilters);
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
      expect(component.options).toEqual(defaultConfigService.defaultApplications.options);
    });

    it('should init groups', () => {
      expect(mockApplicationsDataService.groupsConditions).toBe(lineGroup);
      expect(mockApplicationsDataService.initGroups).toHaveBeenCalled();
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
    expect(mockApplicationsDataService.refresh$.next).toHaveBeenCalled();
  });

  describe('On Options Change', () => {
    beforeEach(() => {
      component.onOptionsChange();
    });

    it('should save options', () => {
      expect(component.line.options).toEqual(mockApplicationsDataService.options);
    });

    it('should refresh', () => {
      expect(mockApplicationsDataService.refresh$.next).toHaveBeenCalled();
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
    const newFilters: FiltersOr<ApplicationRawEnumField> = [[{for: 'root', field: 0, operator: 1, value: 2}]];

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
      component.onFiltersChange(newFilters);
      expect(mockApplicationsDataService.refresh$.next).toHaveBeenCalled();
    });
  });

  describe('OnColumnsChange', () => {
    const newColumns: ApplicationRawColumnKey[] = ['name', 'count', 'service', 'select'];

    beforeEach(() => {
      component.displayedColumnsKeys = ['namespace', 'service'];
      component.line.displayedColumns = ['namespace', 'service'];
    });

    it('should change displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.displayedColumnsKeys).toEqual(['select', 'name', 'count', 'service']);
    });

    it('should change line displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.line.displayedColumns).toEqual(['select', 'name', 'count', 'service']);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onColumnsChange(['select', 'name', 'count', 'service']);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onColumnsReset', () => {
    beforeEach(() => {
      component.displayedColumnsKeys = ['namespace', 'service'];
      component.line.displayedColumns = ['namespace', 'service'];
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
      mockApplicationsDataService.filters = [[{ field: 1, for: 'root', operator: 1, value: 2 }]] as FiltersOr<ApplicationRawEnumField>;
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
      component.onFiltersReset();
      expect(mockApplicationsDataService.refresh$.next).toHaveBeenCalled();
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

  describe('openGroupsSettings', () => {
    const dialogResult = [{fake: 'return'}];
    beforeEach(() => {
      mockMatDialog.open.mockReturnValueOnce({
        afterClosed: () => of(dialogResult)
      });
      component.openGroupsSettings();
    });

    it('should manage the group dialogResult', () => {
      expect(mockApplicationsDataService.manageGroupDialogResult).toHaveBeenCalledWith(dialogResult);
    });

    it('should save the groups', () => {
      expect(component.line.groups).toEqual(mockApplicationsDataService.groupsConditions);
    });
  });
});