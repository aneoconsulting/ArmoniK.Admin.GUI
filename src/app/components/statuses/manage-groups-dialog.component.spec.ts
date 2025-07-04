import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StatusService } from '@app/types/status';
import { IconsService } from '@services/icons.service';
import { Observable, of } from 'rxjs';
import { ManageGroupsDialogComponent } from './manage-groups-dialog.component';
import { DashboardIndexService } from '../../dashboard/services/dashboard-index.service';
import { TasksStatusesGroup } from '../../dashboard/types';

describe('ManageGroupsDialogComponent', () => {
  let component: ManageGroupsDialogComponent;

  let dialogRef$: Observable<TasksStatusesGroup | undefined>;
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return dialogRef$;
        }
      };
    })
  };

  const mockDashboardIndexService = {
    statuses: jest.fn()
  };

  const mockMatDialogRef = {
    close: jest.fn()
  };

  const mockStatusService = {
    statuses: {
      [TaskStatus.TASK_STATUS_CANCELLED]: {
        label: 'Cancelled',
        color: 'red'
      },
      [TaskStatus.TASK_STATUS_PROCESSING]: {
        label: 'Processing',
        color: 'green'
      },
      [TaskStatus.TASK_STATUS_COMPLETED]: {
        label: 'Completed',
        color: 'yellow'
      }
    },
    statusToLabel: jest.fn((s: TaskStatus) => {
      return (mockStatusService.statuses[s]);
    }),
  } as unknown as StatusService<TaskStatus>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ManageGroupsDialogComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        IconsService,
        { provide: DashboardIndexService, useValue: mockDashboardIndexService },
        { provide: StatusService, useValue: mockStatusService },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {
          groups: [
            { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
            { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
            { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]}
          ],
        }}
      ]
    }).inject(ManageGroupsDialogComponent);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.groups).toEqual([
      { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
      { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
      { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]}
    ]);
  });

  it('should get all required icons', () => {
    expect(component.getIcon('delete')).toEqual('delete');
  });

  it('should get statuses labels', () => {
    expect(component.statusToLabel(TaskStatus.TASK_STATUS_COMPLETED)).toEqual(mockStatusService.statuses[TaskStatus.TASK_STATUS_COMPLETED]);
  });

  it('should change array on drop', () => {
    const event = {
      previousContainer: {
        data: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]
      },
      container: {
        data: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]
      },
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<TaskStatus[]>;
    component.onDrop(event);
    expect(event.container.data).toEqual([TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSING]);
    expect(event.previousContainer.data).toEqual([TaskStatus.TASK_STATUS_PROCESSED]);
  });

  it('should change order in an array on drop', () => {
    const container ={
      data:  [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]
    };
    const event = {
      previousContainer: container,
      container: container,
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<TaskStatus[]>;
    component.onDrop(event);
    expect(event.container.data).toEqual([TaskStatus.TASK_STATUS_PROCESSED, TaskStatus.TASK_STATUS_COMPLETED]);
  });

  it('should add a status group', () => {
    dialogRef$ = of({ name: 'newStatuses', color: 'orange', statuses: [TaskStatus.TASK_STATUS_SUBMITTED, TaskStatus.TASK_STATUS_DISPATCHED]});
    component.openAddStatusGroupModal();
    expect(component.groups).toEqual([
      { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
      { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
      { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]},
      { name: 'newStatuses', color: 'orange', statuses: [TaskStatus.TASK_STATUS_SUBMITTED, TaskStatus.TASK_STATUS_DISPATCHED]}
    ]);
  });

  it('should edit a status group', () => {
    dialogRef$ = of({ name: 'Running', color: 'orange', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]});
    component.openEditStatusGroupModal(component.groups[1]);
    expect(component.groups).toEqual([
      { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
      { name: 'Running', color: 'orange', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
      { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]}
    ]);
  });

  it('should delete a group', () => {
    component.onDelete(component.groups[0]);
    expect(component.groups).toEqual([
      { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
      { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]}
    ]);
  });

  it('should close', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});