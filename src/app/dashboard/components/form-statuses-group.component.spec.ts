import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { AbstractControl, FormArray } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormStatusesGroupComponent } from './form-statuses-group.component';

describe('FormStatusesGroupComponent', () => {
  let component: FormStatusesGroupComponent;

  beforeEach(() => {
    component = new FormStatusesGroupComponent();
    component.group = {
      name: 'status',
      color: 'green',
      statuses: [
        TaskStatus.TASK_STATUS_CANCELLED,
        TaskStatus.TASK_STATUS_COMPLETED
      ]
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init', () => {
      component.ngOnInit();
      expect(component.groupForm.value).toEqual({
        name: 'status',
        color: 'green',
        statuses: [8, 4]
      });
    });

    it('should init without color', () => {
      component.group = {name: 'status', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_COMPLETED]};
      component.ngOnInit();
      expect(component.groupForm.value).toEqual({
        name: 'status',
        color: null,
        statuses: [8, 4]
      });
    });
  });

  it('should init without statuses', () => {
    const spyGroupFormGet = jest.spyOn(component.groupForm, 'get');
    spyGroupFormGet.mockImplementationOnce(() => null);
    component.ngOnInit();
    expect(component.groupForm.value).toEqual({
      name: 'status',
      color: 'green',
      statuses: []
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

  it('should update on uncheked', () => {
    const initialObject = {
      controls: [
        {
          value: 'item1'
        },
        {
          value: 'item2'
        },
        {
          value: 'item3'
        }
      ],
      removeAt: jest.fn()
    } as unknown as AbstractControl;
    const spyGroupFormGet = jest.spyOn(component.groupForm, 'get');
    spyGroupFormGet.mockImplementationOnce(() => initialObject);

    const event = {
      checked: false,
      source: {
        value: 'item2'
      }
    } as unknown as MatCheckboxChange;

    component.onCheckboxChange(event);
    expect((initialObject as FormArray).removeAt).toHaveBeenCalledWith(1);
  });

  it('should update on check', () => {
    const initialObject = {
      controls: [
        {
          value: 'item1'
        },
        {
          value: 'item2'
        },
        {
          value: 'item3'
        }
      ],
      push: jest.fn()
    } as unknown as AbstractControl;

    const event = {
      checked: true,
      source: {
        value: 'item4'
      }
    } as unknown as MatCheckboxChange;

    const spyGroupFormGet = jest.spyOn(component.groupForm, 'get');
    spyGroupFormGet.mockImplementationOnce(() => initialObject);

    component.onCheckboxChange(event);
    expect((initialObject as FormArray).push).toHaveBeenCalled();
  });

  it('should not update on check if there is no status', () => {
    const event = {
      checked: true,
      source: {
        value: 'item4'
      }
    } as unknown as MatCheckboxChange;

    const spyGroupFormGet = jest.spyOn(component.groupForm, 'get');
    spyGroupFormGet.mockImplementationOnce(() => null);
    expect(component.onCheckboxChange(event)).toEqual(undefined);
  });

  it('should emit on submit', () => {
    component.groupForm.value.color = 'green';
    component.groupForm.value.name = 'name';
    component.groupForm.value.statuses = ['0', '1'];

    const spySubmit = jest.spyOn(component.submitChange, 'emit');

    component.onSubmit();

    expect(spySubmit).toHaveBeenCalledWith({
      name: 'name',
      color: 'green',
      statuses: [TaskStatus.TASK_STATUS_UNSPECIFIED, TaskStatus.TASK_STATUS_CREATING]
    });
  });

  it('should emit on submit even without values', () => {
    component.groupForm.value.color = undefined;
    component.groupForm.value.name = undefined;
    component.groupForm.value.statuses = undefined;

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

  it('should track by status', () => {
    expect(component.trackByStatus(0, { value: 'value', name: 'name'})).toEqual('value');
  });
});