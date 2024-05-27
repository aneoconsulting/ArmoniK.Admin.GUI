import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditStatusesGroupDialogComponent } from './edit-status-group-dialog.component';
import { TasksStatusesGroup } from '../../dashboard/types';

describe('', () => {
  let component: EditStatusesGroupDialogComponent;

  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        EditStatusesGroupDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {
          statuses: [{ name: 'result', value: 'the-result' }],
          group: { name: 'status', color: 'green', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_COMPLETED]}
        } }
      ]
    }).inject(EditStatusesGroupDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
    expect(component.statuses).toEqual([{ name: 'result', value: 'the-result' }]);
    expect(component.group).toEqual({ name: 'status', color: 'green', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_COMPLETED]});
  });

  it('should close with result on submit', () => {
    const group: TasksStatusesGroup = {name: 'status', color: 'green', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_COMPLETED]};
    component.onSubmit(group);
    expect(mockMatDialogRef.close).toHaveBeenCalledWith(group);
  });

  it('should close on "no" click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});