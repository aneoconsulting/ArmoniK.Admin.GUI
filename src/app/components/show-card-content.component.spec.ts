import { TestBed } from '@angular/core/testing';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { ShowCardContentComponent } from './show-card-content.component';

type obj = {
  my_first_key: string;
  my_second_key: string;
  my_third_key: string | string[];
};

type Data = {
  [key: string]: string | string[] | Data;
};

describe('ShowCardContentComponent', () => {

  let component: ShowCardContentComponent<obj>;

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
    it('Should return true when a string is passed', () => {
      expect(component.isString('mystring')).toBeTruthy();
    });

    it('Should return true when a empty string is passed', () => {
      expect(component.isString('')).toBeTruthy();
    });

    it('Should return false when the given parameter is not a string', () => {
      expect(component.isString(1234)).toBeFalsy();
    });

    it('Should return false when the given parameter is undefined', () => {
      expect(component.isString(undefined)).toBeFalsy();
    });

    it('Should return false when an array is passed', () => {
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

    it('Should return false when an array is passed', () => {
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
    it('Should return true when an array is passed', () => {
      const myArray: Array<number> = [1, 2, 3, 4, 5];
      expect(component.isArray(myArray)).toBeTruthy();
    });

    it('Should return true when an empty array is passed', () => {
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
    it('Should return true when an object is passed', () => {
      expect(component.isObject(new Object())).toBeTruthy();
    });

    it('Should return false when a timestamp is passed', () => {
      expect(component.isObject(new Timestamp())).toBeFalsy;
    });

    it('Should return false when a duration is passed', () => {
      expect(component.isObject(new Duration())).toBeFalsy();
    });

    it('Should return false when an array is passed', () => {
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
    it('Should return true when a duration is passed', () => {
      expect(component.isDuration(new Duration())).toBeTruthy();
    });
    
    it('Should return false when a number is passed', () => {
      expect(component.isDuration(1)).toBeFalsy();
    });

    it('Should return false when a string is passed', () => {
      expect(component.isDuration('my string')).toBeFalsy();
    });
    
    it('Should return false when an array is passed', () => {
      const myArray: Array<number> = [1, 2, 3, 4, 5];
      expect(component.isDuration(myArray)).toBeFalsy();
    });
    
    it('Should return false when undefined is passed', () => {
      expect(component.isDuration(undefined)).toBeFalsy();
    });
  });

  describe('isTimestamp', () => {
    it('Should return true when a timestamp is passed', () => {
      expect(component.isTimestamp(new Timestamp())).toBeTruthy();
    });
    
    it('Should return false when a number is passed', () => {
      expect(component.isTimestamp(1)).toBeFalsy();
    });

    it('Should return false when a string is passed', () => {
      expect(component.isTimestamp('my string')).toBeFalsy();
    });
    
    it('Should return false when an array is passed', () => {
      const myArray: Array<number> = [1, 2, 3, 4, 5];
      expect(component.isTimestamp(myArray)).toBeFalsy();
    });
    
    it('Should return false when undefined is passed', () => {
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
        my_first_key: 'my_first_value',
        my_second_key: 'my_second_value', 
        my_third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findValue('my_first_key')).toEqual('my_first_value');
      expect(component.findValue('my_third_key')).toEqual(['my_third_value', 'my_fourth_value']);
    });

    it('Should return "-" if the key is incorrect', () => {
      component.data = {
        my_first_key: 'my_first_value',
        my_second_key: 'my_second_value', 
        my_third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findValue('some_incorrect_key')).toEqual('-');
    });

    it('Should return "-" if there is no data', () => {
      component.data = [];
      expect(component.findValue('my_first_key')).toEqual('-');
    });
  });

  describe('findArray', () => {

    it('Should return a value if the key is correct', () => {
      component.data = {
        my_first_key: 'my_first_value',
        my_second_key: 'my_second_value', 
        my_third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findArray('my_first_key')).toEqual('my_first_value');
      expect(component.findArray('my_third_key')).toEqual(['my_third_value', 'my_fourth_value']);
    });

    it('Should return an empty array if the key is incorrect', () => {
      component.data = {
        my_first_key: 'my_first_value',
        my_second_key: 'my_second_value', 
        my_third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findArray('some_incorrect_key')).toEqual([]);
    });

    it('Should return an empty array if there is no data', () => {
      component.data = [];
      expect(component.findArray('my_first_key')).toEqual([]);
    });
  });

  describe('findObject', () => {

    it('Should return a value if the key is correct', () => {
      component.data = {
        my_first_key: 'my_first_value',
        my_second_key: 'my_second_value', 
        my_third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findObject('my_first_key')).toEqual('my_first_value' as unknown as Data);
      expect(component.findObject('my_third_key')).toEqual(['my_third_value', 'my_fourth_value'] as unknown as Data);
    });

    it('Should return an empty array if the key is incorrect', () => {
      component.data = {
        my_first_key: 'my_first_value',
        my_second_key: 'my_second_value', 
        my_third_key: ['my_third_value', 'my_fourth_value']
      };
      expect(component.findObject('some_incorrect_key')).toEqual({});
    });

    it('Should return an empty array if there is no data', () => {
      component.data = [];
      expect(component.findObject('my_first_key')).toEqual({});
    });
  });
});