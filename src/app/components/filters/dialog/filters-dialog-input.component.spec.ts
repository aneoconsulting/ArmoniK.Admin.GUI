import { TestBed } from '@angular/core/testing';
import { NgxMatDatepickerInputEvent } from '@angular-material-components/datetime-picker/lib/datepicker-input-base';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FiltersDialogInputComponent } from './filters-dialog-input.component';
import { FilterInputValue } from './types';

describe('FiltersDialogInputComponent', () => {
  let component: FiltersDialogInputComponent;
  const statuses = ['Running', 'Error', 'Done'];

  const registeredOnChange = jest.fn((val: FilterInputValue) => val);
  const registeredOnTouche = jest.fn((val: FilterInputValue) => val);

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        FiltersDialogInputComponent,
        { provide: DataFilterService, useValue: {} },
      ],
    }).inject(FiltersDialogInputComponent);
    component.statuses = statuses;
    component.registerOnChange(registeredOnChange);
    component.registerOnTouched(registeredOnTouche);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('shouldget the value as a string', () => {
    component.value = 'test';
    expect(typeof component.valueAsString).toEqual('string');
  });

  describe('changes', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(component, 'writeValue');
    });

    it('should call write value on change', () => {
      const event = { target: { value: 'value' } };
      component.onChange(event as unknown as Event);
      expect(spy).toHaveBeenCalledWith(event.target.value);
    });

    it('should write on autocompleteChange', () => {
      const value = 'value';
      component.onAutoCompleteChange(value);
      expect(spy).toHaveBeenCalledWith(value);
    });

    it('should write on Boolean change', () => {
      const value = 'True';
      component.onBooleanChange(value);
      expect(spy).toHaveBeenCalledWith('true');
    });

    describe('onDateChange', () => {
      const event = {
        value: {
          getTime: () => 10000
        }
      } as NgxMatDatepickerInputEvent<Date>;

      it('should write value if there is one', () => {
        component.onDateChange(event);
        expect(spy).toHaveBeenCalledWith('10');
      });

      it('should write null if there is no value', () => {
        component.onDateChange({value: null} as NgxMatDatepickerInputEvent<Date>);
        expect(spy).toHaveBeenCalledWith(null);
      });
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
        expect(spy).toHaveBeenLastCalledWith('128135');
      });

      it('should have 0 by default', () => {
        const value = 'NotANumber';
        (inputEvent.target as HTMLInputElement).value = 'NotANumberNeither';
        for (let index = 0; index < 3; index++) {
          component.value = value;
          component.onDurationChange(inputEvent, index);
          expect(spy).toHaveBeenLastCalledWith('0');
        }
      });
    });
  });

  describe('getDurationInputValue', () => {
    describe('valid input value', () => {
      beforeEach(() => {
        component.value = 94350;
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

    describe('invalid input value', () => {
      beforeEach(() => {
        component.value = 'NotANumber';
      });
      it('should get the hours from a duration in seconds', () => {
        expect(component.getDurationInputValue('hours')).toBeUndefined();
      });
      it('should get the minutes from a duration in seconds', () => {
        expect(component.getDurationInputValue('minutes')).toBeUndefined();
      });
      it('should get the seconds from a duration in seconds', () => {
        expect(component.getDurationInputValue('seconds')).toBeUndefined();
      });
      it('should return undefined for an invalid search item', () => {
        expect(component.getDurationInputValue('invalid')).toBeUndefined();
      });
    });
  });

  describe('With existing value', () => {
    const value = 'value';
  
    beforeEach(() => {
      component.writeValue(value);
    });
  
    it('should write the value', () => {
      expect(component.value).toEqual(value);
    });
  
    it('should registered the key on changed', () => {
      expect(registeredOnChange).toHaveBeenCalledWith(value);
    });
      
    it('should registered the key on touched', () => {
      expect(registeredOnTouche).toHaveBeenCalledWith(value);
    });
  });
});