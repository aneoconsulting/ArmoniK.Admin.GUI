import { TestBed } from '@angular/core/testing';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { ShowCardContentComponent } from './show-card-content.component';

type TestingObject = {
  first_key: string | number | {seconds: string | number, nanos: string | number};
  second_key: string | number | {seconds: string | number | undefined, nanos: string | number | undefined};
  third_key: string | string[] | number | {seconds: string | number | undefined, nanos: string | number | undefined};
};

type Data = {
  [key: string]: string | string[] | Data;
};

describe('ShowCardContentComponent', () => {

  let component: ShowCardContentComponent<TestingObject>;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowCardContentComponent
      ]
    }).inject(ShowCardContentComponent);
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  describe('isString', () => {
    it('Should return true when a string is provided', () => {
      expect(component.isString('mystring')).toBeTruthy();
    });

    it('Should return true when a empty string is provided', () => {
      expect(component.isString('')).toBeTruthy();
    });

    it('Should return false when the given parameter is not a string', () => {
      expect(component.isString(1234)).toBeFalsy();
    });

    it('Should return false when the given parameter is undefined', () => {
      expect(component.isString(undefined)).toBeFalsy();
    });

    it('Should return false when an array is provided', () => {
      const myArray: Array<string> = ['1', '2', '3'];
      expect(component.isString(myArray)).toBeFalsy();
    });
  });

  describe('isNumber', () => {
    it('Should return true when the given parameter is a number', () => {
      expect(component.isNumber(1));
    });

    it('Should return false when the given parameter is not a number', () => {
      expect(component.isNumber('Some string')).toBeFalsy();
    });

    it('Should return false when the given parameter is undefined', () => {
      expect(component.isNumber(undefined)).toBeFalsy();
    });

    it('Should return false when an array is provided', () => {
      const myArray: Array<number> = [1, 2, 3, 4, 5];
      expect(component.isNumber(myArray)).toBeFalsy();
    });
  });

  describe('isStatus', () => {
    it('Should return true when a string contains "status"', () => {
      expect(component.isStatus('a string with status')).toBeTruthy();
    });

    it('Should return false when the given string does not have "status"', () => {
      expect(component.isStatus('a string with statu-s')).toBeFalsy();
    });

    it('Should return false when the given parameter is an empty string', () => {
      expect(component.isStatus('')).toBeFalsy();
    });
  });

  describe('isArray', () => {
    it('Should return true when an array is provided', () => {
      const myArray: Array<number> = [1, 2, 3, 4, 5];
      expect(component.isArray(myArray)).toBeTruthy();
    });

    it('Should return true when an empty array is provided', () => {
      const myArray: Array<number> = [];
      expect(component.isArray(myArray)).toBeTruthy();
    });

    it('Should return false when a number is provided', () => {
      expect(component.isArray(1)).toBeFalsy();
    });

    it('Should return false when a string is provided', () => {
      expect(component.isArray('my string')).toBeFalsy();
    });

    it('Should return false when undefined is provided', () => {
      expect(component.isArray(undefined)).toBeFalsy();
    });
  });

  describe('isObject', () => {
    it('Should return true when an object is provided', () => {
      expect(component.isObject(new Object())).toBeTruthy();
    });

    it('Should return false when a timestamp is provided', () => {
      expect(component.isObject(new Timestamp())).toBeFalsy;
    });

    it('Should return false when a duration is provided', () => {
      expect(component.isObject(new Duration())).toBeFalsy();
    });

    it('Should return false when an array is provided', () => {
      const myArray: Array<number> = [1, 2, 3, 4, 5];
      expect(component.isObject(myArray)).toBeFalsy();
    });

    it('Should return false when a string is provided', () => {
      expect(component.isObject('a string')).toBeFalsy();
    });

    it('Should return false when a number is provided', () => {
      expect(component.isObject(1)).toBeFalsy();
    });
    
    it('Should return false when undefinded is provided', () => {
      expect(component.isObject(undefined)).toBeFalsy();
    });
  });

  describe('isDuration', () => {
    it('Should return true when a duration is provided', () => {
      expect(component.isDuration(new Duration())).toBeTruthy();
    });
    
    it('Should return false when a number is provided', () => {
      expect(component.isDuration(1)).toBeFalsy();
    });

    it('Should return false when a string is provided', () => {
      expect(component.isDuration('my string')).toBeFalsy();
    });
    
    it('Should return false when an array is provided', () => {
      const myArray: Array<number> = [1, 2, 3, 4, 5];
      expect(component.isDuration(myArray)).toBeFalsy();
    });
    
    it('Should return false when undefined is provided', () => {
      expect(component.isDuration(undefined)).toBeFalsy();
    });
  });

  describe('isTimestamp', () => {
    it('Should return true when a timestamp is provided', () => {
      expect(component.isTimestamp(new Timestamp())).toBeTruthy();
    });
    
    it('Should return false when a number is provided', () => {
      expect(component.isTimestamp(1)).toBeFalsy();
    });

    it('Should return false when a string is provided', () => {
      expect(component.isTimestamp('my string')).toBeFalsy();
    });
    
    it('Should return false when an array is provided', () => {
      const myArray: Array<number> = [1, 2, 3, 4, 5];
      expect(component.isTimestamp(myArray)).toBeFalsy();
    });
    
    it('Should return false when undefined is provided', () => {
      expect(component.isTimestamp(undefined)).toBeFalsy();
    });
  });

  describe('hasLength', () => {
    it('should return true when an non-empty array is provided', () => {
      expect(component.hasLength([1])).toBeTruthy();
    });

    it('should return false when an empty array is provided', () => {
      expect(component.hasLength([])).toBeFalsy();
    });

    it('should return true when an non-empty string is provided', () => {
      expect(component.hasLength('az')).toBeTruthy();
    });

    it('should return false when an empty string is provided', () => {
      expect(component.hasLength('')).toBeFalsy();
    });

    it('should return false when an number is provided', () => {
      expect(component.hasLength(123)).toBeFalsy();
    });

    it('should return false when undefined is provided', () => {
      expect(component.hasLength(undefined)).toBeFalsy();
    });
  });

  describe('toArray', () => {
    it('Should turn an array into an array', () => {
      expect(component.toArray([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('findValue', () => {

    it('Should return a value if the key is correct', () => {
      component.data = {
        first_key: 'my_first_value',
        second_key: 'my_second_value', 
        third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findValue('first_key')).toEqual('my_first_value');
      expect(component.findValue('third_key')).toEqual(['my_third_value', 'my_fourth_value']);
    });

    it('Should return "-" if the key is incorrect', () => {
      component.data = {
        first_key: 'my_first_value',
        second_key: 'my_second_value', 
        third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findValue('some_incorrect_key')).toEqual('-');
    });

    it('Should return "-" if there is no data', () => {
      component.data = [];
      expect(component.findValue('first_key')).toEqual('-');
    });

    it('Should return "-" if data is null', () => {
      component.data = null;
      expect(component.findValue('first_key')).toEqual('-');
    });
  });

  describe('findArray', () => {

    it('Should return a value if the key is correct', () => {
      component.data = {
        first_key: 'my_first_value',
        second_key: 'my_second_value', 
        third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findArray('first_key')).toEqual('my_first_value');
      expect(component.findArray('third_key')).toEqual(['my_third_value', 'my_fourth_value']);
    });

    it('Should return an empty array if the key is incorrect', () => {
      component.data = {
        first_key: 'my_first_value',
        second_key: 'my_second_value', 
        third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findArray('some_incorrect_key')).toEqual([]);
    });

    it('Should return an empty array if there is no data', () => {
      component.data = [];
      expect(component.findArray('first_key')).toEqual([]);
    });

    it('Should return an empty array if data is null', () => {
      component.data = null;
      expect(component.findArray('first_key')).toEqual([]);
    });
  });

  describe('findObject', () => {

    it('Should return a value if the key is correct', () => {
      component.data = {
        first_key: 'my_first_value',
        second_key: 'my_second_value', 
        third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findObject('first_key')).toEqual('my_first_value' as unknown as Data);
      expect(component.findObject('third_key')).toEqual(['my_third_value', 'my_fourth_value'] as unknown as Data);
    });

    it('Should return an empty array if the key is incorrect', () => {
      component.data = {
        first_key: 'my_first_value',
        second_key: 'my_second_value', 
        third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findObject('some_incorrect_key')).toEqual({});
    });

    it('Should return an empty array if there is no data', () => {
      component.data = [];
      expect(component.findObject('first_key')).toEqual({});
    });

    it('Should return an empty array if data is null', () => {
      component.data = null;
      expect(component.findObject('first_key')).toEqual({});
    });
  });

  describe('toTime', () => {
    it('Should return a string value if the data is correct', () => {
      component.data = {
        first_key: { seconds: '1234', nanos: '456'},
        second_key: { seconds: 1234, nanos: '456'}, 
        third_key: { seconds: '1234', nanos: 456}
      };
      expect(component.toTime('first_key')).toEqual('1234s 456ns');
      expect(component.toTime('second_key')).toEqual('1234s 456ns');
      expect(component.toTime('third_key')).toEqual('1234s 456ns');
    });

    it('Should return "-" if time is equal to 0', () => {
      component.data = {
        first_key: { seconds: '0', nanos: 0},
        second_key: { seconds: '0', nanos: undefined}, 
        third_key: ''
      };
      expect(component.toTime('first_key')).toEqual('-');
      expect(component.toTime('second_key')).toEqual('-');
    });

    it('Should return "-" if the data is invalid', () => {
      component.data = {
        first_key: '1234,456',
        second_key: 'some string', 
        third_key: ['45', '62']
      };
      expect(component.toTime('first_key')).toEqual('-');
      expect(component.toTime('second_key')).toEqual('-');
      expect(component.toTime('third_key')).toEqual('-');
    });

    it('Should return "-" if the data is empty',() => {
      expect(component.toTime('first_key')).toEqual('-');
      expect(component.toTime('some_randow_key')).toEqual('-');
    });
  });

  describe('toTimestamp', () => {
    it('Should return a timestamp value if the data is correct', () => {
      component.data = {
        first_key: { seconds: '1234', nanos: '456'},
        second_key: { seconds: 1234, nanos: '456'}, 
        third_key: { seconds: '1234', nanos: 456}
      };

      const expectedResult: Date = new Timestamp({
        seconds: '1234',
        nanos: 456
      }).toDate();

      expect(component.toTimestamp('first_key')).toEqual(expectedResult);
      expect(component.toTimestamp('second_key')).toEqual(expectedResult);
      expect(component.toTimestamp('third_key')).toEqual(expectedResult);
    });

    it('Should return "-" if time is equal to 0', () => {
      component.data = {
        first_key: { seconds: '0', nanos: 0},
        second_key: { seconds: 0, nanos: undefined}, 
        third_key: {seconds: undefined, nanos: undefined}
      };
      expect(component.toTimestamp('first_key')).toEqual('-');
      expect(component.toTimestamp('second_key')).toEqual('-');
      expect(component.toTimestamp('third_key')).toEqual('-');
    });

    it('Should return "-" if the data is invalid', () => {
      component.data = {
        first_key: '1234,456',
        second_key: 'some string', 
        third_key: ['45', '62']
      };
      expect(component.toTimestamp('first_key')).toEqual('-');
      expect(component.toTimestamp('second_key')).toEqual('-');
      expect(component.toTimestamp('third_key')).toEqual('-');
    });

    it('Should return "-" if the data is empty',() => {
      expect(component.toTimestamp('first_key')).toEqual('-');
      expect(component.toTimestamp('some_randow_key')).toEqual('-');
    });
  });

  describe('statusToLabel', () => {
    it('Should return a label if the key and data are correct', () => {

      component.statuses = {1: 'My_first_label', 2: 'My_second_label'};

      component.data = {
        first_key: '1',
        second_key: 2, 
        third_key: ['45', '62']
      };
      expect(component.statusToLabel('first_key')).toEqual('My_first_label');
      expect(component.statusToLabel('second_key')).toEqual('My_second_label');
    });

    it('Should return "-" if no data is provided', () => {
      component.statuses = {1: 'My_first_label', 2: 'My_second_label'};
      expect(component.statusToLabel('first_key')).toEqual('-');
    });

    it('Should return "-" if no statuses are provided', () => {
      component.data = {
        first_key: '1',
        second_key: 2, 
        third_key: ['45', '62']
      };
      expect(component.statusToLabel('first_key')).toEqual('-');
    });

    it('Should return "-" if the data key is invalid', () => {
      component.statuses = {1: 'My_first_label', 2: 'My_second_label'};

      component.data = {
        first_key: '1',
        second_key: 2, 
        third_key: ['45', '62']
      };
      expect(component.statusToLabel('some_random_key')).toEqual('-');
    });

    it('Should return "-" if the data value is invalid', () => {
      component.statuses = {1: 'My_first_label', 2: 'My_second_label'};

      component.data = {
        first_key: 'invalid data',
        second_key: 3, 
        third_key: ['45', '62']
      };
      expect(component.statusToLabel('first_key')).toEqual('-');
      expect(component.statusToLabel('second_key')).toEqual('-');
    });
  });

  it('pretty should return readable strings', () => {
    expect(component.pretty('My string should not change.')).toEqual('My string should not change.');
    expect(component.pretty('MyStringShouldChange.')).toEqual('My string should change.');
    expect(component.pretty('My_String_Should_Change_.')).toEqual('My string should change.');
  });

  describe('ngOnChange', () => {
    it('Should sort data keys and store it into keys on change', () => {
      component.data = {
        first_key: 'my_first_value',
        second_key: 'my_second_value', 
        third_key: ['my_third_value', 'my_fourth_value']
      };
      component.ngOnChanges();
      expect(component.keys).toEqual(['first_key', 'second_key', 'third_key']);
    });

    it('Should not do anything if there is no data', () => {
      component.ngOnChanges();
      expect(component.keys).toEqual([]);
    });
  });

  it('trackByKey', () => {
    const key = 'my_key';
    expect(component.trackByKey(0, key)).toBe(key);
  });

  it('trackByItem', () => {
    expect(component.trackByItem(0, 1)).toEqual('1');
    expect(component.trackByItem(0, undefined)).toEqual('undefined');
  });
});