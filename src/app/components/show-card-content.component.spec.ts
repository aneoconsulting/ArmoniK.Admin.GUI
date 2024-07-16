import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { ShowCardContentComponent } from './show-card-content.component';

/**
 * This item will help us test the various cases of the component.
 * Its structure covers every possible case of the component's data, which
 * is why it is call SandBox.
 */
type SandBox = {
  [key: string]: string | (string | number)[] | number | undefined | {seconds: string | number | undefined, nanos: string | number | undefined} | SandBox;
};

type Data = {
  [key: string]: string | string[] | Data;
};

const time: Timestamp = new Timestamp({
  seconds: '179543301',
  nanos: 0
});

const duration = new Duration({
  seconds: '3600',
  nanos: 10
});

const data: SandBox = {
  string: 'valid-string',
  empty: '',
  number: 1,
  undefined: undefined,
  array: [1, 2, 3],
  emptyArray: [],
  status: 'some-false-status',
  object: {
    value: 'some-value'
  },
  time: time,
  duration: duration,
};

describe('ShowCardContentComponent', () => {
  let component: ShowCardContentComponent<SandBox>;

  beforeEach(() => {
    component = new ShowCardContentComponent();
    component.data = data;
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  describe('isString', () => {
    it('Should return true when a string is provided', () => {
      expect(component.isString('string')).toBeTruthy();
    });

    it('Should return true when a empty string is provided', () => {
      expect(component.isString('empty')).toBeTruthy();
    });

    it('Should return false when the given parameter is not a string', () => {
      expect(component.isString('number')).toBeFalsy();
    });

    it('Should return false when the given parameter is undefined', () => {
      expect(component.isString('undefined')).toBeFalsy();
    });

    it('Should return false when an array is provided', () => {
      expect(component.isString('array')).toBeFalsy();
    });
  });

  describe('isNumber', () => {
    it('Should return true when the given parameter is a number', () => {
      expect(component.isNumber('number'));
    });

    it('Should return false when the given parameter is not a number', () => {
      expect(component.isNumber('string')).toBeFalsy();
    });

    it('Should return false when the given parameter is undefined', () => {
      expect(component.isNumber('undefined')).toBeFalsy();
    });

    it('Should return false when an array is provided', () => {
      expect(component.isNumber('array')).toBeFalsy();
    });
  });

  describe('isStatus', () => {
    it('Should return true when a string contains "status"', () => {
      expect(component.isStatus('status')).toBeTruthy();
    });

    it('Should return false when the given string does not have "status"', () => {
      expect(component.isStatus('string')).toBeFalsy();
    });

    it('Should return false when the given parameter is an empty string', () => {
      expect(component.isStatus('empty')).toBeFalsy();
    });
  });

  describe('isArray', () => {
    it('Should return true when an array is provided', () => {
      expect(component.isArray(data['array'])).toBeTruthy();
    });

    it('Should return true when an empty array is provided', () => {
      expect(component.isArray(data['emptyArray'])).toBeTruthy();
    });

    it('Should return false when a number is provided', () => {
      expect(component.isArray(data['number'])).toBeFalsy();
    });

    it('Should return false when a string is provided', () => {
      expect(component.isArray(data['string'])).toBeFalsy();
    });

    it('Should return false when undefined is provided', () => {
      expect(component.isArray(data['undefined'])).toBeFalsy();
    });
  });

  describe('isObject', () => {
    it('Should return true when an object is provided', () => {
      expect(component.isObject('object')).toBeTruthy();
    });

    it('Should return false when a timestamp is provided', () => {
      expect(component.isObject('time')).toBeFalsy;
    });

    it('Should return false when a duration is provided', () => {
      expect(component.isObject('duration')).toBeFalsy();
    });

    it('Should return false when an array is provided', () => {
      expect(component.isObject('array')).toBeFalsy();
    });

    it('Should return false when a string is provided', () => {
      expect(component.isObject('string')).toBeFalsy();
    });

    it('Should return false when a number is provided', () => {
      expect(component.isObject('number')).toBeFalsy();
    });
    
    it('Should return false when undefinded is provided', () => {
      expect(component.isObject('undefined')).toBeFalsy();
    });
  });

  describe('isDuration', () => {
    it('Should return true when a duration is provided', () => {
      expect(component.isDuration('duration')).toBeTruthy();
    });
    
    it('Should return false when a number is provided', () => {
      expect(component.isDuration('number')).toBeFalsy();
    });

    it('Should return false when a string is provided', () => {
      expect(component.isDuration('string')).toBeFalsy();
    });
    
    it('Should return false when an array is provided', () => {
      expect(component.isDuration('array')).toBeFalsy();
    });
    
    it('Should return false when undefined is provided', () => {
      expect(component.isDuration('undefined')).toBeFalsy();
    });
  });

  describe('isTimestamp', () => {
    it('Should return true when a timestamp is provided', () => {
      expect(component.isTimestamp('time')).toBeTruthy();
    });
    
    it('Should return false when a number is provided', () => {
      expect(component.isTimestamp('number')).toBeFalsy();
    });

    it('Should return false when a string is provided', () => {
      expect(component.isTimestamp('string')).toBeFalsy();
    });
    
    it('Should return false when an array is provided', () => {
      expect(component.isTimestamp('array')).toBeFalsy();
    });
    
    it('Should return false when undefined is provided', () => {
      expect(component.isTimestamp('undefined')).toBeFalsy();
    });
  });

  describe('hasLength', () => {
    it('should return true when an non-empty array is provided', () => {
      expect(component.hasLength(data['array'])).toBeTruthy();
    });

    it('should return false when an empty array is provided', () => {
      expect(component.hasLength(data['emptyArray'])).toBeFalsy();
    });

    it('should return true when an non-empty string is provided', () => {
      expect(component.hasLength(data['string'])).toBeTruthy();
    });

    it('should return false when an empty string is provided', () => {
      expect(component.hasLength(data['empty'])).toBeFalsy();
    });

    it('should return false when an number is provided', () => {
      expect(component.hasLength(data['number'])).toBeFalsy();
    });

    it('should return false when undefined is provided', () => {
      expect(component.hasLength(data['undefined'])).toBeFalsy();
    });
  });

  describe('toArray', () => {
    it('Should turn an array into an array', () => {
      expect(component.toArray([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('findArray', () => {
    it('Should return a value if the key is correct', () => {
      component.data = {
        first_key: 'first_value',
        second_key: 'second_value', 
        third_key: ['third_value', 'fourth_value']
      };
      expect(component.findArray('first_key')).toEqual('first_value');
      expect(component.findArray('third_key')).toEqual(['third_value', 'fourth_value']);
    });

    it('Should return an empty array if the key is incorrect', () => {
      component.data = {
        first_key: 'first_value',
        second_key: 'second_value', 
        third_key: ['third_value', 'fourth_value']
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
        first_key: 'first_value',
        second_key: 'second_value', 
        third_key: ['third_value', 'fourth_value']
      };
      expect(component.findObject('first_key')).toEqual('first_value' as unknown as Data);
      expect(component.findObject('third_key')).toEqual(['third_value', 'fourth_value'] as unknown as Data);
    });

    it('Should return an empty array if the key is incorrect', () => {
      component.data = {
        first_key: 'first_value',
        second_key: 'second_value', 
        third_key: ['third_value', 'fourth_value']
      };
      expect(component.findObject('some_incorrect_key')).toEqual({});
    });

    it('Should return an empty array if there is no data', () => {
      component.data = [];
      expect(component.findObject('first_key')).toEqual({});
    });

    it('Should return an empty array if data is null', () => {
      component.data = null;
      expect(component.findObject('')).toEqual({});
    });
  });

  describe('statusToLabel', () => {
    it('Should return a label if the key and data are correct', () => {

      component.statuses = {1: 'first_label', 2: 'second_label'};

      component.data = {
        first_key: '1',
        second_key: 2, 
        third_key: ['45', '62']
      };
      expect(component.statusToLabel('first_key')).toEqual('first_label');
      expect(component.statusToLabel('second_key')).toEqual('second_label');
    });

    it('Should return "null" if no data is provided', () => {
      component.statuses = {1: 'first_label', 2: 'second_label'};
      expect(component.statusToLabel('first_key')).toBeNull();
    });

    it('Should return "null" if no statuses are provided', () => {
      component.data = {
        first_key: '1',
        second_key: 2, 
        third_key: ['45', '62']
      };
      expect(component.statusToLabel('first_key')).toBeNull();
    });

    it('Should return "null" if the data key is invalid', () => {
      component.statuses = {1: 'first_label', 2: 'second_label'};

      component.data = {
        first_key: '1',
        second_key: 2, 
        third_key: ['45', '62']
      };
      expect(component.statusToLabel('some_random_key')).toBeNull();
    });

    it('Should return "null" if the data value is invalid', () => {
      component.statuses = {1: 'first_label', 2: 'second_label'};

      component.data = {
        first_key: 'invalid data',
        second_key: 3, 
        third_key: ['45', '62']
      };
      expect(component.statusToLabel('first_key')).toBeNull();
      expect(component.statusToLabel('second_key')).toBeNull();
    });
  });

  describe('toDate', () => {
    it ('should return a date from a timestamp', () => {
      expect(component.toDate('time')).toEqual(new Date(179543301000));
    });

    it('should return undefined if there is no data', () => {
      component.data = undefined as unknown as SandBox;
      expect(component.toDate('time')).toBeUndefined();
    });
  });

  describe('toDuration', () => {
    it('should return the data as a duration', () => {
      expect(component.toDuration('duration') instanceof Duration).toBeTruthy();
    });

    it('should return null if the data is undefined', () => {
      component.data = undefined as unknown as SandBox;
      expect(component.toDuration('duration')).toBeNull();
    });
  });
});