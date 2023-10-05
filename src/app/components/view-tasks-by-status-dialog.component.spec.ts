import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TasksStatusesService } from '@app/tasks/services/tasks-status.service';
import { TaskStatusColored } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { ViewTasksByStatusDialogComponent } from './view-tasks-by-status-dialog.component';

describe('ViewTasksByStatusDialogComponent', () => {
  let component: ViewTasksByStatusDialogComponent;
  let fixture: ComponentFixture<ViewTasksByStatusDialogComponent>;
  const mockMatDialogData = {
    statusesCounts: [] as TaskStatusColored[]
  };
  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      providers: [
        ViewTasksByStatusDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef},
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        IconsService,
        TasksStatusesService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTasksByStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockMatDialogData.statusesCounts = [
      { status: TaskStatus.TASK_STATUS_COMPLETED, color: 'green' },
      { status: TaskStatus.TASK_STATUS_PROCESSING, color: 'yellow'},
      { status: TaskStatus.TASK_STATUS_CREATING, color: 'dark-red'}
    ] as TaskStatusColored[];
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('clear')).toEqual('clear');
  });

  it('should retrieve tasks keys with tasksStatuses', () => {
    expect(component.tasksStatuses().sort()).toEqual([
      TaskStatus.TASK_STATUS_UNSPECIFIED.toString(),
      TaskStatus.TASK_STATUS_DISPATCHED.toString(),
      TaskStatus.TASK_STATUS_CREATING.toString(),
      TaskStatus.TASK_STATUS_SUBMITTED.toString(),
      TaskStatus.TASK_STATUS_PROCESSING.toString(),
      TaskStatus.TASK_STATUS_PROCESSED.toString(),
      TaskStatus.TASK_STATUS_CANCELLING.toString(),
      TaskStatus.TASK_STATUS_CANCELLED.toString(),
      TaskStatus.TASK_STATUS_COMPLETED.toString(),
      TaskStatus.TASK_STATUS_ERROR.toString(),
      TaskStatus.TASK_STATUS_TIMEOUT.toString(),
      TaskStatus.TASK_STATUS_RETRIED.toString()
    ].sort());
  });

  it('should retrieve a label by its corresponding status', () => {
    expect(component.statusToLabel(TaskStatus.TASK_STATUS_COMPLETED)).toEqual('Finished');
  });

  describe('isUsedStatus', () => {
    it('should show whether or not a status is used', () => {
      expect(component.isUsedStatus(TaskStatus.TASK_STATUS_CANCELLED)).toBeFalsy();
      expect(component.isUsedStatus(TaskStatus.TASK_STATUS_COMPLETED)).toBeTruthy();
    });

    it('should return false if the statusesCount list is empty', () => {
      component.statusesCounts = null;
      expect(component.isUsedStatus(TaskStatus.TASK_STATUS_COMPLETED)).toBeFalsy();
    });
  });

  describe('onStatusChange', () => {
    it('should update status', () => {
      component.onStatusChange(0, '3');
      if(component.statusesCounts) 
        expect(component.statusesCounts[0].status).toEqual(3);
    });
    
    it('should not update status if the index is incorrect', () => {
      expect(() => {component.onStatusChange(3, '3');}).toThrowError(TypeError);
    });

    it('should not update status if the list is empty', () => {
      component.statusesCounts = null;
      expect(component.onStatusChange(0, '3')).toBeUndefined();
    });
  });

  describe('onColorChange', () => {
    const inputEvent = {
      target: {
        value: 'grey'
      }
    } as unknown as Event;

    it('should update color', () => {
      component.onColorChange(0, inputEvent);
      if(component.statusesCounts) 
        expect(component.statusesCounts[0].color).toEqual('grey');
    });
    
    it('should not update color if the index is incorrect', () => {
      expect(() => {component.onColorChange(3, inputEvent);}).toThrowError(TypeError);
    });

    it('should not update color if the list is empty', () => {
      component.statusesCounts = null;
      expect(component.onColorChange(0, inputEvent)).toBeUndefined();
    });
  });

  it('should clear a tasksStatusColored', () => {
    const count: TaskStatusColored = {
      status: TaskStatus.TASK_STATUS_ERROR,
      color: 'red'
    };
    component.onClear(count);
    expect(count).toEqual({
      status: TaskStatus.TASK_STATUS_UNSPECIFIED,
      color: '#000000'
    });
  });

  describe('onRemove', () => {
    it('should remove a count if the index is correct', () => {
      component.onRemove(1);
      expect(component.statusesCounts).toEqual([
        { status: TaskStatus.TASK_STATUS_COMPLETED, color: 'green' },
        { status: TaskStatus.TASK_STATUS_CREATING, color: 'dark-red'}
      ]);
    });

    it('should not remove anything if the index is incorrect', () => {
      component.onRemove(3);
      expect(component.statusesCounts).toEqual([
        { status: TaskStatus.TASK_STATUS_COMPLETED, color: 'green' },
        { status: TaskStatus.TASK_STATUS_PROCESSING, color: 'yellow'},
        { status: TaskStatus.TASK_STATUS_CREATING, color: 'dark-red'}
      ]);
    });

    // it('should not remove anythin if the list is null', () => {
    //   component.statusesCounts = null;
    //   component.onRemove(0);
    //   expect(component.statusesCounts).toBen
    // })
  });

  describe('onAdd', () => {
    it('should add a default status to the statuses', () => {
      component.onAdd();
      expect(component.statusesCounts).toEqual([
        { status: TaskStatus.TASK_STATUS_COMPLETED, color: 'green' },
        { status: TaskStatus.TASK_STATUS_PROCESSING, color: 'yellow'},
        { status: TaskStatus.TASK_STATUS_CREATING, color: 'dark-red'},
        { status: TaskStatus.TASK_STATUS_UNSPECIFIED, color: '#000000'}
      ]);
    });

    // it('should not add a default ')
  });

  it('should call MatDialogRef.close on close', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  describe('drop', () => {

    const dropEvent = {
      previousIndex: 0,
      currentIndex: 2
    } as unknown as CdkDragDrop<TaskStatusColored[]>;

    it('should move an item in the array', () => {
      component.onDrop(dropEvent);
      expect(component.statusesCounts).toEqual([
        { status: TaskStatus.TASK_STATUS_PROCESSING, color: 'yellow'},
        { status: TaskStatus.TASK_STATUS_CREATING, color: 'dark-red'},
        { status: TaskStatus.TASK_STATUS_COMPLETED, color: 'green' },
      ]);
    });

    it('should not move any item if the list is null', () => {
      component.statusesCounts = null;
      expect(component.onDrop(dropEvent)).toBeUndefined();
    });
  });
});