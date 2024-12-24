import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditStatusesGroupDialogComponent } from './edit-status-group-dialog.component';

describe('', () => {
  let component: EditStatusesGroupDialogComponent;

  const mockMatDialogRef = {
    close: jest.fn()
  };

  const statusesLabelsColors = {
    [TaskStatus.TASK_STATUS_CANCELLED]: {
      label: 'Cancelled',
      color: 'black',
    },
    [TaskStatus.TASK_STATUS_COMPLETED]: {
      label: 'Completed',
      color: 'green',
    },
    [TaskStatus.TASK_STATUS_ERROR]: {
      label: 'Error',
      color: 'red',
    }
  };

  const group = { name: 'status', color: 'green', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_COMPLETED]};

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        EditStatusesGroupDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {
          statuses: statusesLabelsColors,
          group: group,
        } }
      ]
    }).inject(EditStatusesGroupDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.data.statuses).toEqual(statusesLabelsColors);
    expect(component.group).toEqual(group);
  });

  it('should close with result on submit', () => {
    component.onSubmit(group);
    expect(mockMatDialogRef.close).toHaveBeenCalledWith(group);
  });

  it('should close on "no" click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});