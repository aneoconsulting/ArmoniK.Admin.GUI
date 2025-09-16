import { TestBed } from '@angular/core/testing';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { NgxMatDatepickerInputEvent } from '@ngxmc/datetime-picker';
import { Moment } from 'moment';
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

  it('should get the value as a string', () => {
    component.value = 'test';
    expect(typeof component.valueAsString).toEqual('string');
  });

  it('should set the component dateForm if the provided value is a number for a date filter', () => {
    const date = 1234;
    component.type = 'date';
    component.writeValue(`${date}`);
    expect(component.dateForm.value).toEqual(new Date(date * 1000));
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
          toDate: jest.fn(() => ({
            getTime: jest.fn(() => 10000), 
          })),
        }
      } as unknown as NgxMatDatepickerInputEvent<Moment>;

      it('should write value if there is one', () => {
        component.onDateChange(event);
        expect(spy).toHaveBeenCalledWith('10');
      });

      it('should write null if there is no value', () => {
        component.onDateChange({value: null} as NgxMatDatepickerInputEvent<Moment>);
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
        expect(component.getDurationInputValue('invalid' as 'hours')).toBeUndefined(); // Cast the string to another specific string type to test completely the code.
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
        expect(component.getDurationInputValue('invalid' as 'minutes')).toBeUndefined(); // Cast the string to another specific string type to test completely the code.
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