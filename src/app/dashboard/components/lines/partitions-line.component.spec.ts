import { ListPartitionsResponse, PartitionRaw } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { PartitionsGrpcService } from '@app/partitions/services/partitions-grpc.service';
import { PartitionsIndexService } from '@app/partitions/services/partitions-index.service';
import { PartitionRawColumnKey, PartitionRawFieldKey, PartitionRawListOptions } from '@app/partitions/types';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { PartitionsLineComponent } from './partitions-line.component';
import { Line } from '../../types';

describe('PartitionsLineComponent', () => {
  let component: PartitionsLineComponent;

  const options: PartitionRawListOptions = {
    pageIndex: 0,
    pageSize: 5,
    sort: {
      active: 'id' as PartitionRawFieldKey,
      direction: 'desc',
    },
  };

  const line: Line = {
    name: 'Partitions',
    type: 'Partitions',
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

  const mockGrpcPartitionsService = {
    list$: jest.fn()
  };

  const mockNotificationService = {
    error: jest.fn()
  };

  const columnsLabels = ['Id', 'Parents Ids', 'Pod configuration', 'Pod Max', 'Reserved pod', 'Preemption percentage', 'Count', 'Priority'];

  const mockPartitionsIndexService = {
    availableColumns: ['id', 'parentPartitionIds', 'podConfiguration', 'podMax', 'podReserved', 'preemptionPercentage', 'count', 'priority'],
    columnsLabels: columnsLabels,
    resetColumns: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        PartitionsLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: PartitionsGrpcService, useValue: mockGrpcPartitionsService },
        AutoRefreshService,
        IconsService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: PartitionsIndexService, useValue: mockPartitionsIndexService },
        DefaultConfigService
      ]
    }).inject(PartitionsLineComponent);
    component.line = line;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    const intervalSpy = jest.spyOn(component.interval, 'next');
    component.ngOnInit();
    expect(component.loadPartitionData).toBeTruthy();
    expect(component.filters).toBe(line.filters);
    expect(intervalSpy).toHaveBeenCalledWith(line.interval);
  });

  it('should create subscriptions after init', () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    expect(mockGrpcPartitionsService.list$).toHaveBeenCalledWith(options, component.filters);
  });

  describe('Data fetching', () => {
    it('should load received data', () => {
      const receivedData: ListPartitionsResponse = {
        partitions: [
          {
            id: 'partition 1',
            parentPartitionIds: [
              'id1', 'id2'
            ]
          },
          {
            id: 'partition 2',
            parentPartitionIds: [
              'id1', 'id2'
            ]
          }
        ],
        total: 2
      } as ListPartitionsResponse;
      mockGrpcPartitionsService.list$.mockImplementationOnce(() => of(receivedData));
      component.ngAfterViewInit();
      expect(component.data).toEqual(receivedData.partitions);
      expect(component.total).toEqual(receivedData.total);
    });

    it('should load default data', () => {
      component.data = [{id: 'partitions', parentPartitionIds: ['id1', 'id2']}] as unknown as PartitionRaw[];
      mockGrpcPartitionsService.list$.mockImplementationOnce(() => of(null));
      component.ngAfterViewInit();
      expect(component.data).toEqual([]);
      expect(component.total).toEqual(0);
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
    const refreshSpy = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should get columns labels', () => {
    expect(component.columnsLabels()).toBe(columnsLabels);
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
      const refreshSpy = jest.spyOn(component.refresh, 'next');
      component.onFiltersChange(newFilters);
      expect(refreshSpy).toHaveBeenCalled();
    });
  });

  describe('onOptionsChange', () => {
    it('should change line options', () => {
      const newOptions: PartitionRawListOptions = {
        pageIndex: 2,
        pageSize: 25,
        sort: {
          active: 'podMax',
          direction: 'desc'
        }
      };
      component.options = newOptions;
      component.onOptionsChange();
      expect(component.line.options).toEqual(newOptions);
    });

    it('should refresh', () => {
      const optionsSpy = jest.spyOn(component.optionsChange, 'next');
      component.onOptionsChange();
      expect(optionsSpy).toHaveBeenCalled();
    });

    it('should emit', () => {
      const lineSpy = jest.spyOn(component.lineChange, 'emit');
      component.onOptionsChange();
      expect(lineSpy).toHaveBeenCalled();
    });
  });

  describe('OnColumnsChange', () => {
    const newColumns: PartitionRawColumnKey[] = ['id', 'count', 'parentPartitionIds'];

    beforeEach(() => {
      component.displayedColumns = ['id', 'parentPartitionIds'];
      component.line.displayedColumns = ['id', 'parentPartitionIds'];
    });

    it('should change displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.displayedColumns).toEqual(newColumns);
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
    const defaultColumns: PartitionRawColumnKey[] = ['id', 'parentPartitionIds'];
    mockPartitionsIndexService.resetColumns.mockImplementation(() => defaultColumns);

    beforeEach(() => {
      component.displayedColumns = ['id', 'parentPartitionIds'];
      component.line.displayedColumns = ['id', 'parentPartitionIds'];
    });

    it('should reset to default columns', () => {
      component.onColumnsReset();
      expect(component.displayedColumns).toEqual(defaultColumns);
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
      const refreshSpy = jest.spyOn(component.refresh, 'next');
      component.onFiltersReset();
      expect(refreshSpy).toHaveBeenCalled();
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