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

  it('should not display hours when there are none', () => {
    expect(pipe.transform({ seconds: '61', nanos: 123456789 } as Duration)).toEqual('1m 1s 123ms');
  });

  it('should not display minutes when there are none', () => {
    expect(pipe.transform({ seconds: '1', nanos: 123456789 } as Duration)).toEqual('1s 123ms');
  });

  it('should not display seconds when there are none', () => {
    expect(pipe.transform({ seconds: '0', nanos: 123456789 } as Duration)).toEqual('123ms');
  });

  it('should not display milliseconds when there are none', () => {
    expect(pipe.transform({ seconds: '1', nanos: 0 } as Duration)).toEqual('1s');
  });
});