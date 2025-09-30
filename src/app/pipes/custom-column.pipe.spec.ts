import { CustomColumnPipe } from './custom-column.pipe';

describe('CustomColumnPipe', () => {
  const pipe = new CustomColumnPipe();
  
  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should transform a custom column into a readable column', () => {
      const readableColumn = 'FastCompute';
      expect(pipe.transform(`options.options.${readableColumn}`)).toEqual(readableColumn);
    });

    it('should not transform a string into a readable column', () => {
      expect(pipe.transform('taskId')).toBeNull();
    });

    it('should not transform a number', () => {
      expect(pipe.transform(1)).toBeNull();
    });
  });
});