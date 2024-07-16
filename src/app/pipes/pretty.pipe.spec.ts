import { PrettyPipe } from './pretty.pipe';

describe('PrettyPipe', () => {
  const pipe = new PrettyPipe();

  it('should make a string prettier', () => {
    const uglyString = '_ABeautiful_String';
    const prettyString = 'A Beautiful String';
    expect(pipe.transform(uglyString)).toEqual(prettyString);
  });
});