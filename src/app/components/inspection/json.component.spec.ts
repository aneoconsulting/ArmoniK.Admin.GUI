import { JsonComponent } from './json.component';

describe('JsonComponent', () => {
  const component = new JsonComponent();
  
  const data = {
    one: 1,
    two: 2,
    object: {
      three: 3
    },
    array: [1, 2, 3]
  };

  beforeEach(() => {
    component.data = data;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data', () => {
    expect(component.data).toEqual(data);
  });

  it('should set keys', () => {
    expect(component.keys).toEqual(['one', 'two', 'object', 'array']);
  });

  describe('isArray', () => {
    it('should return true if an array is passed', () => {
      expect(component.isArray('array' as keyof object)).toBeTruthy();
    });

    it('should return false if an object is passed', () => {
      expect(component.isArray('object' as keyof object)).toBeFalsy();
    });

    it('should return false if a simple value is passed', () => {
      expect(component.isArray('one' as keyof object)).toBeFalsy();
    });
  });

  describe('isObject', () => {
    it('should return true if an object is passed', () => {
      expect(component.isObject('object' as keyof object)).toBeTruthy();
    });

    it('should return true if an array is passed', () => {
      expect(component.isObject('array' as keyof object)).toBeTruthy();
    });

    it('should return false if a simple value is passed', () => {
      expect(component.isObject('one' as keyof object)).toBeFalsy();
    });
  });
});