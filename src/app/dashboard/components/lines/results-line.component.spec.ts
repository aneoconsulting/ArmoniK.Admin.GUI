import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import ResultsDataService from '@app/results/services/results-data.service';
import { ResultsIndexService } from '@app/results/services/results-index.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFieldKey, ResultRawListOptions } from '@app/results/types';
import { TableColumn } from '@app/types/column.type';
import { FiltersOr } from '@app/types/filters';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { of } from 'rxjs';
import { ResultsLineComponent } from './results-line.component';
import { TableLine } from '../../types';

describe('ResultsLineComponent', () => {
  let component: ResultsLineComponent;

  const defaultConfigService = new DefaultConfigService();

  const defaultColumns: ResultRawColumnKey[] = ['name', 'resultId'];

  const displayedColumns: TableColumn<ResultRaw>[] = [
    {
      key: 'resultId',
      name: 'ID',
      type: 'link',
      link: '/results/',
      sortable: true
    },
    {
      key: 'name',
      name: 'Name',
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
      name: 'Size',
      key: 'size',
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

  const options: ResultRawListOptions = {
    pageIndex: 0,
    pageSize: 5,
    sort: {
      active: 'name' as ResultRawFieldKey,
      direction: 'desc',
    },
  };

  const line: TableLine<ResultRaw> = {
    name: 'Tasks',
    type: 'Results',
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
    open: jest.fn(() => {
      return {
        afterClosed() {
          return of(nameLine);
        }
      };
    }),
  };

  const mockResultsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [] as FiltersOr<ResultRawEnumField>,
    refresh$: {
      next: jest.fn()
    },
  };

  const mockResultsIndexService = {
    availableTableColumns: displayedColumns,
    defaultColumns: defaultColumns,
    resetColumns: jest.fn(() => new DefaultConfigService().defaultResults.columns),
    restoreColumns: jest.fn(() => ['name', 'count']),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        AutoRefreshService,
        IconsService,
        { provide: ResultsDataService, useValue: mockResultsDataService },
        { provide: ResultsIndexService, useValue: mockResultsIndexService },
        DefaultConfigService,
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).inject(ResultsLineComponent);
    component.line = line;
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should load properly', () => {
    expect(component.loading).toEqual(mockResultsDataService.loading);
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
      expect(component.options).toEqual(defaultConfigService.defaultResults.options);
      expect(component.showFilters).toEqual(line.showFilters);
    });
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
    component.refresh();
    expect(mockResultsDataService.refresh$.next).toHaveBeenCalled();
  });

  describe('On Options Change', () => {
    beforeEach(() => {
      component.onOptionsChange();
    });

    it('should save options', () => {
      expect(component.line.options).toEqual(mockResultsDataService.options);
    });

    it('should refresh', () => {
      expect(mockResultsDataService.refresh$.next).toHaveBeenCalled();
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
    const newFilters: FiltersOr<ResultRawEnumField> = [[{for: 'root', field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT, operator: 1, value: 2}]];

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
      expect(mockResultsDataService.refresh$.next).toHaveBeenCalled();
    });
  });

  describe('OnColumnsChange', () => {
    const newColumns: ResultRawColumnKey[] = ['resultId', 'name', 'sessionId', 'select'];

    beforeEach(() => {
      component.displayedColumnsKeys = ['actions', 'resultId'] as ResultRawColumnKey[];
      component.line.displayedColumns = ['ownerTaskId', 'size'] as ResultRawColumnKey[];
    });

    it('should change displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.displayedColumnsKeys).toEqual(['select', 'resultId', 'name', 'sessionId']);
    });

    it('should change line displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.line.displayedColumns).toEqual(['select', 'resultId', 'name', 'sessionId']);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onColumnsChange(['select', 'resultId', 'name', 'sessionId']);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onColumnsReset', () => {
    beforeEach(() => {
      component.displayedColumnsKeys = ['resultId', 'name'] as ResultRawColumnKey[];
      component.line.displayedColumns = ['createdAt', 'actions'] as ResultRawColumnKey[];
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
      mockResultsDataService.filters = [[{ field: 1, for: 'root', operator: 1, value: 2 }]];
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
      expect(mockResultsDataService.refresh$.next).toHaveBeenCalled();
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
});