import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { EditNameLineResult } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { ReorganizeLinesDialogComponent } from './reorganize-lines-dialog.component';
import { Line } from '../types';

describe('ReorganizeLinesDialogComponent', () => {
  let component: ReorganizeLinesDialogComponent;

  const defaultLines: Line[] = [
    {
      name: 'line1',
      type: 'Tasks',
      interval: 10,
      hideGroupsHeader: false,
      filters: [],
      taskStatusesGroups: [
        { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
        { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
        { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]}
      ],
    },
    {
      name: 'line2',
      type: 'Tasks',
      interval: 20,
      hideGroupsHeader: true,
      filters: [],
      taskStatusesGroups: [
        { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
        { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
        { name: 'Unspecified', color: 'grey', statuses: [TaskStatus.TASK_STATUS_UNSPECIFIED, TaskStatus.TASK_STATUS_RETRIED]}
      ],
    }
  ];

  let dialogRef$: Observable<EditNameLineResult>;
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return dialogRef$;
        }
      };
    })
  };

  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ReorganizeLinesDialogComponent,
        IconsService,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {
          lines: structuredClone(defaultLines)
        }},
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).inject(ReorganizeLinesDialogComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.lines).toEqual(defaultLines);
  });

  it('should get required icons', () => {
    expect(component.getIcon('drag')).toEqual('drag_indicator');
    expect(component.getIcon('edit')).toEqual('edit');
    expect(component.getIcon('delete')).toEqual('delete');
  });

  it('should close', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  it('should change array on drop', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1,
    } as unknown as CdkDragDrop<Line[]>;
    component.onDrop(event);
    expect(component.lines).toEqual(structuredClone(defaultLines).reverse());
  });

  it('should delete a line', () => {
    component.onDeleteLine(component.lines[0]);
    expect(component.lines).toEqual(
      [{
        name: 'line2',
        interval: 20,
        hideGroupsHeader: true,
        filters: [],
        taskStatusesGroups: [
          { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
          { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
          { name: 'Unspecified', color: 'grey', statuses: [TaskStatus.TASK_STATUS_UNSPECIFIED, TaskStatus.TASK_STATUS_RETRIED]}
        ],
      }]
    );
  });

  it('should edit a name line', () => {
    const newName = {name: 'newLineName'};
    dialogRef$ = of(newName);
    component.onEditNameLine(component.lines[1], 1);
    expect(component.lines[1].name).toEqual('newLineName');
  });

  it('should track by line', () => {
    expect(component.trackByLine(0, component.lines[0])).toEqual('line10');
  });
});