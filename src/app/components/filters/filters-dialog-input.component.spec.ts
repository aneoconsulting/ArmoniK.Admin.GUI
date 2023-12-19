// eslint-disable-next-line import/no-unresolved
import { NgxMatDatepickerInputEvent } from '@angular-material-components/datetime-picker/lib/datepicker-input-base';
import { FiltersDialogInputComponent } from './filters-dialog-input.component';

describe('FiltersDialogInputComponent', () => {
  const component = new FiltersDialogInputComponent();
  component.input = {
    type: 'string',
    value: 'someValue'
  };
  const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on string change', () => {
    const event = {
      target: {
        value: 'stringValue'
      }
    } as unknown as Event;

    component.onStringChange(event);
    expect(valueChangeSpy).toHaveBeenCalledWith({
      type: 'string',
      value: 'stringValue'
    });
  });

  it('should emit on valid number change', () => {
    const event = {
      target: {
        value: 1
      }
    } as unknown as Event;
    
    component.onNumberChange(event);
    expect(valueChangeSpy).toHaveBeenCalledWith({
      type: 'number',
      value: 1
    });
  });

  it('should not emit on invalid number change', () => {
    const event = {
      target: {
        value: 'stringValue'
      }
    } as unknown as Event;

    component.onNumberChange(event);
    expect(valueChangeSpy).toHaveBeenCalledTimes(0);
  });

  it('should emit on end Date change', () => {
    const event = {
      value: new Date(19043234000) // Date takes milliseconds, not seconds.
    } as unknown as NgxMatDatepickerInputEvent<Date>;

    component.onDateChange(event);
    expect(valueChangeSpy).toHaveBeenCalledWith({
      type: 'date',
      value: 19043234
    });
  });

  it('should emit on status change', () => {
    const event = 'newStatus';

    component.onStatusChange(event);
    expect(valueChangeSpy).toHaveBeenCalledWith({
      type: 'string',
      value: event
    });
  });

  it('should get input type', () => {
    const inputTypes = ['string', 'number', 'date', 'array', 'status', 'other'];
    for (const index in inputTypes) {
      component.input.type = inputTypes[index] as 'string' | 'number' | 'date' | 'array' | 'status';
      if (inputTypes[index] === 'array' || inputTypes[index] === 'other') {
        expect(component.getInputType()).toEqual('string');
      }
      else {
        expect(component.getInputType()).toEqual(inputTypes[index]);
      }
    }
  });

  it('should track by selected', () => {
    const item = {
      value: 'selected'
    };
    expect(component.trackBySelect(0, item)).toBe(item.value);
  });
});