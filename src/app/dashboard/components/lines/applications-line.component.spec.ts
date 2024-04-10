import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ApplicationsIndexService } from '@app/applications/services/applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawFieldKey, ApplicationRawListOptions } from '@app/applications/types';
import { TableColumn } from '@app/types/column.type';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { ApplicationsLineComponent } from './applications-line.component';
import { Line } from '../../types';

describe('ApplicationsLineComponent', () => {
  let component: ApplicationsLineComponent;

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

  const options: ApplicationRawListOptions = {
    pageIndex: 0,
    pageSize: 5,
    sort: {
      active: 'name' as ApplicationRawFieldKey,
      direction: 'desc',
    },
  };

  const line: Line = {
    name: 'Tasks',
    type: 'Applications',
    filters: [],
    interval: 20,
    options: options
  };

  const nameLine = {
    name: 'NewNameLine'
  };
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return of(nameLine);
        }
      };
    }),
  };

  const mockApplicationsIndexService = {
    availableTableColumns: displayedColumns,
    resetColumns: jest.fn(() => new DefaultConfigService().defaultApplications.columns),
    restoreColumns: jest.fn(() => ['name', 'count']),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        AutoRefreshService,
        IconsService,
        { provide: ApplicationsIndexService, useValue: mockApplicationsIndexService },
        DefaultConfigService
      ]
    }).inject(ApplicationsLineComponent);
    component.line = line;
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    const intervalSpy = jest.spyOn(component.interval, 'next');
    component.ngOnInit();
    expect(component.loading).toBeTruthy();
    expect(component.filters).toBe(line.filters);
    expect(intervalSpy).toHaveBeenCalledWith(line.interval);
  });

  it('should unsubscribe on destroy', () => {
    const subSpy = jest.spyOn(component.subscriptions, 'unsubscribe');
    component.ngOnDestroy();
    expect(subSpy).toHaveBeenCalled();
  });

  it('should get icon', () => {
    expect(component.getIcon('tune')).toEqual('tune');
  });

  it('should generate an autoRefresh tooltip', () => {
    expect(component.autoRefreshTooltip()).toEqual(`Auto-refresh every ${line.interval} seconds`);
  });

  it('should refresh', () => {
    const refreshSpy = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(refreshSpy).toHaveBeenCalled();
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

  it('should edit the name line', () => {
    component.onEditNameLine('NewNameLine');
    expect(component.line.name).toEqual('NewNameLine');
  });

  it('should emit on edit name line', () => {
    const spy = jest.spyOn(component.lineChange, 'emit');
    component.onEditNameLine('NewNameLine');
    expect(spy).toHaveBeenCalled();
  });

  it('should emit on delete line', () => {
    const spy = jest.spyOn(component.lineDelete, 'emit');
    component.onDeleteLine(line);
    expect(spy).toHaveBeenCalledWith(line);
  });

  describe('onFilterChange', () => {
    const newFilters = [[{for: 'root', field: 0, operator: 1, value: 2}]];

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
      const spyFilters = jest.spyOn(component.filters$, 'next');
      component.onFiltersChange(newFilters);
      expect(spyFilters).toHaveBeenCalled();
    });
  });

  describe('OnColumnsChange', () => {
    const newColumns: ApplicationRawColumnKey[] = ['name', 'count', 'service'];

    beforeEach(() => {
      component.displayedColumnsKeys = ['namespace', 'service'];
      component.line.displayedColumns = ['namespace', 'service'];
    });

    it('should change displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.displayedColumnsKeys).toEqual(newColumns);
    });

    it('should change line displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.line.displayedColumns).toEqual(newColumns);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onColumnsChange(newColumns);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onColumnsReset', () => {
    const defaultColumns: ApplicationRawColumnKey[] = ['name', 'count'];
    mockApplicationsIndexService.resetColumns.mockImplementation(() => defaultColumns);

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
      component.filters = [[{ field: 1, for: 'root', operator: 1, value: 2 }]];
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
      const spyFilters = jest.spyOn(component.filters$, 'next');
      component.onFiltersReset();
      expect(spyFilters).toHaveBeenCalled();
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
});