import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, PartitionData } from '@app/types/data';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { of } from 'rxjs';
import { PartitionsTableComponent } from './table.component';
import PartitionsDataService from '../services/partitions-data.service';
import { PartitionRaw } from '../types';

describe('TasksTableComponent', () => {
  let component: PartitionsTableComponent;

  const displayedColumns: TableColumn<PartitionRaw>[] = [
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

  const mockClipBoard = {
    copy: jest.fn()
  };

  const defaultStatusesGroups: TasksStatusesGroup[] = [
    {
      name: 'Completed',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED],
      color: '#4caf50',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR],
      color: '#ff0000',
    },
  ];

  const mockDialogReturn: ManageGroupsDialogResult = {
    groups: [
      {
        name: 'Timeout',
        statuses: [TaskStatus.TASK_STATUS_TIMEOUT],
        color: '#ff6944',
      },
      {
        name: 'Retried',
        statuses: [TaskStatus.TASK_STATUS_RETRIED],
        color: '#ff9800',
      }
    ]
  };

  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: jest.fn(() => of(mockDialogReturn))
      };
    })
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(() => defaultStatusesGroups),
    saveStatuses: jest.fn()
  };

  const mockPartitionsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
  };

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        PartitionsTableComponent,
        { provide: PartitionsDataService, useValue: mockPartitionsDataService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
        { provide: NotificationService, useValue: mockNotificationService },
      ]
    }).inject(PartitionsTableComponent);

    component.displayedColumns = displayedColumns;
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });

  test('onDrop should emit', () => {
    const spy = jest.spyOn(component.columnUpdate, 'emit');
    const newColumns: ColumnKey<PartitionRaw>[] = ['actions', 'id', 'parentPartitionIds', 'preemptionPercentage'];
    component.onDrop(newColumns);
    expect(spy).toHaveBeenCalledWith(newColumns);
  });

  test('onOptionsChange should emit', () => {
    const spy = jest.spyOn(component.optionsUpdate, 'emit');
    component.onOptionsChange();
    expect(spy).toHaveBeenCalled();
  });

  describe('personnalizeTasksByStatus', () => {
    beforeEach(() => {
      component.personalizeTasksByStatus();
    });

    it('should update statusesGroups', () => {
      expect(component.statusesGroups).toEqual(mockDialogReturn.groups);
    });

    it('should call tasksByStatus service',() => {
      expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith(component.table, component.statusesGroups);
    });
  });

  describe('isDataRawEqual', () => {
    it('should return true if two partitionRaws are the same', () => {
      const partition1 = { id: 'partition' } as PartitionRaw;
      const partition2 = { ...partition1 } as PartitionRaw;
      expect(component.isDataRawEqual(partition1, partition2)).toBeTruthy();
    });

    it('should return false if two partitionRaws are differents', () => {
      const partition1 = { id: 'partition' } as PartitionRaw;
      const partition2 = { id: 'partition2' } as PartitionRaw;
      expect(component.isDataRawEqual(partition1, partition2)).toBeFalsy();
    });
  });

  it('should track a partition by its id', () => {
    const partition = {raw: { id: 'partition' }} as PartitionData;
    expect(component.trackBy(0, partition)).toEqual(partition.raw.id);
  });

  it('should get data', () => {
    expect(component.data).toEqual(mockPartitionsDataService.data);
  });

  it('should get total', () => {
    expect(component.total).toEqual(mockPartitionsDataService.total);
  });

  it('should get options', () => {
    expect(component.options).toEqual(mockPartitionsDataService.options);
  });

  it('should get filters', () => {
    expect(component.filters).toEqual(mockPartitionsDataService.filters);
  });

  it('should get column keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(c => c.key));
  });

  it('should get displayedColumns', () => {
    expect(component.displayedColumns).toEqual(displayedColumns);
  });
});