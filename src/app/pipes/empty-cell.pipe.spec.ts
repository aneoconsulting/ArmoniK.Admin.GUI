import { EmptyCellPipe } from './empty-cell.pipe';

describe('EmptyCellPipe', () => {
  const pipe = new EmptyCellPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return "-" when value is undefined', () => {
    expect(pipe.transform(undefined)).toEqual('-');
  });

  it('should return "-" when value is null', () => {
    expect(pipe.transform(null)).toEqual('-');
  });

  it('should return "-" when value is an empty string', () => {
    expect(pipe.transform('')).toEqual('-');
  });

  it('should return the value when value is not empty', () => {
    const value = 'some value';
    expect(pipe.transform(value)).toEqual(value);
  });
});