import { Duration } from '@ngx-grpc/well-known-types';
import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null when value is null', () => {
    expect(pipe.transform(null)).toEqual(null);
  });

  it('should return null when seconds and nanos are both null', () => {
    expect(pipe.transform({ seconds: '0', nanos: 0 } as Duration)).toEqual(null);
  });

  it('should return the duration in hours, minutes, seconds and milliseconds', () => {
    expect(pipe.transform({ seconds: '3661', nanos: 123456789 } as Duration)).toEqual('1h 1m 1s 123ms');
  });

  it('should not display useless time unities', () => {
    expect(pipe.transform({ seconds: '0', nanos: 123456789 } as Duration)).toEqual('123ms');
    expect(pipe.transform({ seconds: '1', nanos: 0 } as Duration)).toEqual('1s');
  });
});