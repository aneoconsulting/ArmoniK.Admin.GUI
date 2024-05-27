import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddStatusesGroupDialogComponent } from './add-statuses-group-dialog.component';
import { TasksStatusesGroup } from '../../dashboard/types';

describe('', () => {
  let component: AddStatusesGroupDialogComponent;

  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        AddStatusesGroupDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {
          statuses: [{ name: 'result', value: 'the-result' }]
        } }
      ]
    }).inject(AddStatusesGroupDialogComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
    expect(component.statuses).toEqual([{ name: 'result', value: 'the-result' }]);
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