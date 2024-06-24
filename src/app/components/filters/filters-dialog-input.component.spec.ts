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
    const eventValue = 'stringValue';
    const event = {
      target: {
        value: eventValue
      }
    } as unknown as Event;

    component.onChange(event);
    expect(valueChangeSpy).toHaveBeenCalledWith(eventValue);
  });

  describe('on date change', () => {
    it('should emit the value', () => {
      const milliseconds = 19043234000;
      const event = {
        value: new Date(milliseconds) // Date takes milliseconds, not seconds.
      } as unknown as NgxMatDatepickerInputEvent<Date>;
  
      component.onDateChange(event);
      expect(valueChangeSpy).toHaveBeenCalledWith(`${milliseconds / 1000}`);
    });

    it('should emit null if there is no value', () => {
      const event = {
        value: null
      } as unknown as NgxMatDatepickerInputEvent<Date>;
  
      component.onDateChange(event);
      expect(valueChangeSpy).toHaveBeenCalledWith('');
    });
  });
  
  it('should emit on boolean change', () => {
    const booleanValue = 'true';
    component.onBooleanChange(booleanValue);
    expect(valueChangeSpy).toHaveBeenCalledWith(booleanValue);
  });

  it('should emit on status change', () => {
    const event = 'newStatus';
    component.onStatusChange(event);
    expect(valueChangeSpy).toHaveBeenCalledWith(event);
  });

  describe('onDurationChange', () => {
    const inputEvent = {
      target: {
        value: '35'
      }
    } as unknown as Event;
  
    it('should emit a duration', () => {
      for (let index = 0; index < 3; index++) {
        component.onDurationChange(inputEvent, index);
      }
      expect(valueChangeSpy).toHaveBeenLastCalledWith('128135');
    });

    it('should look for the duration input values', () => {
      (inputEvent.target as HTMLInputElement).value = 'NaN value';
      for (let index = 0; index < 3; index++) {
        component.onDurationChange(inputEvent, index);
      }
      component.input.value = 94350;
      component.onDurationChange(inputEvent, 0);
      expect(valueChangeSpy).toHaveBeenLastCalledWith(`${component.input.value}`);
    });
  });

  describe('getDurationInputValue', () => {
    beforeEach(() => {
      component.input.value = 94350;
    });
    it('should get the hours from a duration in seconds', () => {
      expect(component.getDurationInputValue('hours')).toEqual(26);
    });
    it('should get the minutes from a duration in seconds', () => {
      expect(component.getDurationInputValue('minutes')).toEqual(12);
    });
    it('should get the seconds from a duration in seconds', () => {
      expect(component.getDurationInputValue('seconds')).toEqual(30);
    });
    it('should return undefined for an invalid search item', () => {
      expect(component.getDurationInputValue('invalid')).toBeUndefined();
    });
  });
});