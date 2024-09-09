import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormStatusesGroupComponent } from './form-statuses-group.component';

describe('FormStatusesGroupComponent', () => {
  const component = new FormStatusesGroupComponent();

  const statuses: { name: string, value: string }[] = [
    { name: 'Completed', value: `${TaskStatus.TASK_STATUS_COMPLETED}` },
    { name: 'Cancelled', value: `${TaskStatus.TASK_STATUS_CANCELLED}` },
    { name: 'Processed', value: `${TaskStatus.TASK_STATUS_PROCESSED}` }
  ];

  beforeEach(() => {
    component.statuses = statuses;
    component.group = {
      name: 'status',
      statuses: [
        TaskStatus.TASK_STATUS_CANCELLED,
        TaskStatus.TASK_STATUS_COMPLETED
      ]
    };
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should complete form', () => {
      expect(component.groupForm.value).toEqual({
        name: 'status',
        color: null,
        statuses: [8, 4]
      });
    });
  });

  it('should return true if it is checked', () => {
    expect(component.isChecked({name: 'status', value: '4'})).toBeTruthy();
  });

  it('should return false if it is not checked', () => {
    expect(component.isChecked({name: 'status', value: '5'})).toBeFalsy();
  });

  it('should return false by default', () => {
    component.group = null;
    expect(component.isChecked({name: 'status', value: '4'})).toBeFalsy();
  });

  describe('onCheckboxChange', () => {
    it('should update on uncheked', () => {
      const groupFormStatuses = [
        TaskStatus.TASK_STATUS_PROCESSED,
        TaskStatus.TASK_STATUS_COMPLETED,
        TaskStatus.TASK_STATUS_CANCELLED
      ];
      component.groupForm.patchValue({ statuses: groupFormStatuses });
      const event = {
        checked: false,
        source: {
          value: `${TaskStatus.TASK_STATUS_COMPLETED}`
        }
      } as unknown as MatCheckboxChange;

      component.onCheckboxChange(event);
      expect(component.groupForm.value.statuses?.length).toEqual(2);
    });

    it('should update on check', () => {
      const groupFormStatuses = [
        TaskStatus.TASK_STATUS_COMPLETED,
        TaskStatus.TASK_STATUS_CANCELLED
      ];
      component.groupForm.patchValue({ statuses: groupFormStatuses });

      const event = {
        checked: true,
        source: {
          value: `${TaskStatus.TASK_STATUS_PROCESSED}`
        }
      } as unknown as MatCheckboxChange;

      component.onCheckboxChange(event);
      expect(component.groupForm.value.statuses?.length).toEqual(3);
    });

    it('should set the group name as the first selected status', () => {
      component.groupForm.patchValue({name: undefined, statuses: []});
      const event = {
        checked: true,
        source: {
          value: `${TaskStatus.TASK_STATUS_PROCESSED}`
        }
      } as unknown as MatCheckboxChange;
      
      component.onCheckboxChange(event);
      expect(component.groupForm.value.name).toEqual('Processed');
    });
  });

  it('should emit on submit', () => {
    const newGroup = {
      name: 'name',
      color: 'green',
      statuses: [TaskStatus.TASK_STATUS_UNSPECIFIED, TaskStatus.TASK_STATUS_CREATING]
    };
    component.groupForm.setValue(newGroup);

    const spySubmit = jest.spyOn(component.submitChange, 'emit');
    component.onSubmit();

    expect(spySubmit).toHaveBeenCalledWith(newGroup);
  });

  it('should emit on submit even without values', () => {
    const undefinedGroup = {
      name: null,
      color: null,
      statuses: null
    };
    component.groupForm.setValue(undefinedGroup);

    const spySubmit = jest.spyOn(component.submitChange, 'emit');

    component.onSubmit();
    expect(spySubmit).toHaveBeenCalledWith({
      name: '',
      color: '',
      statuses: []
    });
  });

  it('should emit on cancel', () => {
    const spyCancel = jest.spyOn(component.cancelChange, 'emit');
    component.onCancel();
    expect(spyCancel).toHaveBeenCalled();
  });
});