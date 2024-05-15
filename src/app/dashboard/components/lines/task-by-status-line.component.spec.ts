import { CountTasksByStatusResponse, FilterStringOperator, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TaskSummaryFilters } from '@app/tasks/types';
import { ManageGroupsDialogComponent } from '@components/statuses/manage-groups-dialog.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { TaskByStatusLineComponent } from './task-by-status-line.component';
import { TasksStatusesGroup } from '../../types';

describe('TaskByStatusLineComponent', () => {
  let component: TaskByStatusLineComponent;

  let dialogRefSubject: Observable<string | {groups: TasksStatusesGroup[]} | null>;
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return dialogRefSubject;
        }
      };
    })
  };

  const mockTasksGrpcService = {
    countByStatus$: jest.fn(() => of({
      status:[
        {status:TaskStatus.TASK_STATUS_CANCELLED, count: 3},
        {status: TaskStatus.TASK_STATUS_COMPLETED, count: 10},
        {status: TaskStatus.TASK_STATUS_PROCESSING, count: 145}
      ]
    } as CountTasksByStatusResponse)),
  };

  const filters: TaskSummaryFilters = [[{
    field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
    operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
    for: 'root',
    value: 'examplefilter'
  }]];

  const mockTasksIndexService = {};

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TaskByStatusLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        AutoRefreshService,
        IconsService,
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
        { provide: TasksIndexService, useValue: mockTasksIndexService }
      ]
    }).inject(TaskByStatusLineComponent);
    component.line = {
      filters: filters,
      hideGroupsHeader: true,
      interval: 10,
      name: 'name',
      type: 'Tasks',
      taskStatusesGroups: []
    };
    component.ngOnInit();
    component.ngAfterViewInit();
    component.total = 0;
    component.data = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('after view init subscription', () => {
    component.refresh.next();

    expect(component.data).toEqual([
      {status:TaskStatus.TASK_STATUS_CANCELLED, count: 3},
      {status: TaskStatus.TASK_STATUS_COMPLETED, count: 10},
      {status: TaskStatus.TASK_STATUS_PROCESSING, count: 145}
    ]);
    expect(component.total).toEqual(158);
    expect(component.loadTasksStatus).toBeFalsy();
  });

  it('should get required icons', () => {
    expect(component.getIcon('more')).toEqual('more_vert');
    expect(component.getIcon('view')).toEqual('visibility');
    expect(component.getIcon('view-off')).toEqual('visibility_off');
    expect(component.getIcon('tune')).toEqual('tune');
    expect(component.getIcon('edit')).toEqual('edit');
    expect(component.getIcon('delete')).toEqual('delete');
  });

  it('should say that the auto refresh is enabled', () => {
    expect(component.autoRefreshTooltip()).toEqual('Auto-refresh every 10 seconds');
  });

  it('should say that the auto refresh is disabled', () => {
    component.line.interval = 0;
    expect(component.autoRefreshTooltip()).toEqual('Auto-refresh is disabled');
  });

  it('should refresh', () => {
    const spyRefresh = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(spyRefresh).toHaveBeenCalled();
  });

  it('should emit on interval change', () => {
    const spyLineChange = jest.spyOn(component.lineChange, 'emit');
    component.onIntervalValueChange(10);
    expect(spyLineChange).toHaveBeenCalled();
  });

  it('should update on interval change to 0', () => {
    const spyStop = jest.spyOn(component.stopInterval, 'next');
    component.onIntervalValueChange(0);
    expect(spyStop).toHaveBeenCalled();
  });

  it('should update on interval change', () => {
    const spyInterval = jest.spyOn(component.interval, 'next');
    const spyRefresh = jest.spyOn(component.refresh, 'next');
    component.onIntervalValueChange(15);
    expect(spyInterval).toHaveBeenCalledWith(15);
    expect(spyRefresh).toHaveBeenCalled();
  });

  it('should update on group header toggle', () => {
    component.onToggleGroupsHeader();
    expect(component.line.hideGroupsHeader).toBeFalsy();
  });

  it('should emit on group header toggle', () => {
    const spyLineChange = jest.spyOn(component.lineChange, 'emit');
    component.onToggleGroupsHeader();
    expect(spyLineChange).toHaveBeenCalled();
  });

  it('should update the line name on edit name line', () => {
    const newName = 'newName';
    dialogRefSubject = of(newName);
    component.onEditNameLine(newName);
    expect(component.line.name).toEqual(newName);
  });

  it('should not update the line name on edit name line if the input is empty', () => {
    const newName = 'newName';
    dialogRefSubject = of(null);
    component.onEditNameLine(newName);
    expect(component.line.name).toEqual('name');
  });

  it('should emit on edit name', () => {
    const spyLineChange = jest.spyOn(component.lineChange, 'emit');
    const newName = 'newName';
    dialogRefSubject = of(newName);
    component.onEditNameLine(newName);
    expect(spyLineChange).toHaveBeenCalled();
  });

  it('should emit value on deleting line', () => {
    const spyLineDelete = jest.spyOn(component.lineDelete, 'emit');
    component.onDeleteLine(component.line);
    expect(spyLineDelete).toHaveBeenCalledWith(component.line);
  });

  describe('onManageGroupsDialog', () => {
    it('should update tasks statuses groups on manage group', () => {
      dialogRefSubject = of({
        groups: [
          {
            name: 'status',
            color: 'green',
            statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_DISPATCHED]
          }
        ]
      });
      component.onManageGroupsDialog();
      expect(component.line.taskStatusesGroups).toEqual([{
        name: 'status',
        color: 'green',
        statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_DISPATCHED]
      }]);
    });
  
    it('should not update tasks statuses groups on manage group', () => {
      dialogRefSubject = of(null);
      component.onManageGroupsDialog();
      expect(component.line.taskStatusesGroups).toEqual([]);
    });
  
    it('should not update tasks statuses groups on manage group', () => {
      const spyLineChange = jest.spyOn(component.lineChange, 'emit');
      dialogRefSubject = of({
        groups: [
          {
            name: 'status',
            color: 'green',
            statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_DISPATCHED]
          }
        ]
      });
      component.onManageGroupsDialog();
      expect(spyLineChange).toHaveBeenCalledWith();
    });

    it('should use default empty list if no statuses groups are provided', () => {
      component.line.taskStatusesGroups = undefined;
      component.onManageGroupsDialog();
      expect(mockMatDialog.open).toHaveBeenCalledWith(ManageGroupsDialogComponent, {
        data: {
          groups: []
        }
      });
    });
  });

  it('should update filters on filters change', () => {
    const newFilters = ['examplefilter'];
    component.onFiltersChange(newFilters);
    expect(component.line.filters).toEqual(newFilters);
  });

  it('should emit on filters change', () => {
    const spyLineChange = jest.spyOn(component.lineChange, 'emit');
    component.onFiltersChange([]);
    expect(spyLineChange).toHaveBeenCalled();
  });

  it('should refresh on filters change', () => {
    const spyRefresh = jest.spyOn(component.refresh, 'next');
    component.onFiltersChange([]);
    expect(spyRefresh).toHaveBeenCalled();
  });

  it('should return the filters', () => {
    expect(component.taskByStatusFilters).toEqual(filters);
  });
});