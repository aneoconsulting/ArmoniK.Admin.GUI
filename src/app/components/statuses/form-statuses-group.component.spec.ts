import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { StatusLabelColor } from '@app/types/status';
import { FormStatusesGroupComponent } from './form-statuses-group.component';

describe('FormStatusesGroupComponent', () => {
  const component = new FormStatusesGroupComponent();

  const statusesLabelsColors = {
    [TaskStatus.TASK_STATUS_CANCELLED]: {
      label: 'Cancelled',
      color: 'black',
    },
    [TaskStatus.TASK_STATUS_COMPLETED]: {
      label: 'Completed',
      color: 'green',
    },
    [TaskStatus.TASK_STATUS_PROCESSED]: {
      label: 'Processed',
      color: 'orange',
    }
  } as Record<TaskStatus, StatusLabelColor>;

  const defaultGroup = {
    name: 'status',
    color: 'green',
    statuses: [
      TaskStatus.TASK_STATUS_CANCELLED,
      TaskStatus.TASK_STATUS_COMPLETED
    ]
  };

  beforeEach(() => {
    component.statuses = statusesLabelsColors;
    component.group = defaultGroup;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should complete form', () => {
      expect(component.groupForm.value).toEqual(defaultGroup);
    });

    it('should init even with a empty group', () => {
      component.group = null;
      component.ngOnInit();
      expect(component.groupForm.value).toEqual({
        name: null,
        color: null,
        statuses: [],
      });
    });
  });

  describe('isChecked', () => {
    it('should return true', () => {
      expect(component.isChecked('4')).toBeTruthy();
    });
  
    it('should return false', () => {
      expect(component.isChecked('5')).toBeFalsy();
    });
  
    it('should return false by default', () => {
      component.group = null;
      expect(component.isChecked('4')).toBeFalsy();
    });
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
      component.groupForm.patchValue({name: null, color: null, statuses: []});
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


  it('should get a status label', () => {
    expect(component.getLabel(`${TaskStatus.TASK_STATUS_COMPLETED}`)).toEqual(statusesLabelsColors[TaskStatus.TASK_STATUS_COMPLETED].label);
  });

  describe('Submitting', () => {
    it('should emit', () => {
      const spySubmit = jest.spyOn(component.submitChange, 'emit');
      component.onSubmit();
  
      expect(spySubmit).toHaveBeenCalledWith(defaultGroup);
    });
  
    it('should emit even without values', () => {
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
  });

  it('should emit on cancel', () => {
    const spyCancel = jest.spyOn(component.cancelChange, 'emit');
    component.onCancel();
    expect(spyCancel).toHaveBeenCalled();
  });
});