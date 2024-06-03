import { FormControl } from '@angular/forms';
// eslint-disable-next-line import/no-unresolved
import { NgxMatDatepickerInputEvent } from '@angular-material-components/datetime-picker/lib/datepicker-input-base';
import { Subject, lastValueFrom } from 'rxjs';
import { FiltersDialogInputComponent } from './filters-dialog-input.component';

describe('FiltersDialogInputComponent', () => {
  const component = new FiltersDialogInputComponent();
  component.input = {
    type: 'string',
    value: 'someValue'
  };
  component.statusFormControl = new FormControl();
  const filteredStatuses = new Subject<string[]>();
  component.filteredStatuses = filteredStatuses;
  const valueChangeSpy = jest.spyOn(component.valueChange, 'emit');

  beforeEach(() => {
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should init boolean form control', () => {
      expect(component.booleanFormControl.value).toEqual(component.input.value);
    });

    it('should observe form control value changes', () => {
      expect(component.filteredBooleans).toBeTruthy();
    });
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

  describe('on date change', () => {
    it('should emit the value', () => {
      const event = {
        value: new Date(19043234000) // Date takes milliseconds, not seconds.
      } as unknown as NgxMatDatepickerInputEvent<Date>;
  
      component.onDateChange(event);
      expect(valueChangeSpy).toHaveBeenCalledWith({
        type: 'date',
        value: 19043234
      });
    });

    it('should emit null if there is no value', () => {
      const event = {
        value: null
      } as unknown as NgxMatDatepickerInputEvent<Date>;
  
      component.onDateChange(event);
      expect(valueChangeSpy).toHaveBeenCalledWith({
        type: 'date',
        value: null
      });
    });
  });
  
  it('should emit on boolean change', () => {
    component.booleanFormControl.setValue('true');
    component.onBooleanChange();
    expect(valueChangeSpy).toHaveBeenCalledWith({
      type: 'boolean',
      value: true
    });
  });

  it('should emit on status change', () => {
    const event = 'newStatus';
    component.statusFormControl.setValue(event);
    component.onStatusChange();
    expect(valueChangeSpy).toHaveBeenCalledWith({
      type: 'status',
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
      expect(valueChangeSpy).toHaveBeenLastCalledWith({
        type: 'duration',
        value: 128135
      });
    });

    it('should look for the duration input values', () => {
      (inputEvent.target as HTMLInputElement).value = 'NaN value';
      for (let index = 0; index < 3; index++) {
        component.onDurationChange(inputEvent, index);
      }
      component.input.value = 94350;
      component.onDurationChange(inputEvent, 0);
      expect(valueChangeSpy).toHaveBeenLastCalledWith({
        type: 'duration',
        value: component.input.value
      });
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

  describe('filter boolean', () => {
    it('should map to filterBoolean', () => {
      component.booleanFormControl.setValue('ue');
      lastValueFrom(component.filteredBooleans).then((result) => {
        expect(result).toEqual(['true']);
      });
    });

    it('should filter properly', () => {
      expect(component['_filterBoolean']('ue')).toEqual(['true']);
    });

    it('should return all booleans by default', () => {
      expect(component['_filterBoolean'](null)).toEqual(['true', 'false']);
    });
  });
});