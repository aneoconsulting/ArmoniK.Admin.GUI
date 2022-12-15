import { mergeMap, throwError, timer } from 'rxjs';
import { TimeFilter } from '../../types/time-filter-type';

export class BaseGrpcService {
  // Timeout for gRPC requests. 8 seconds is an arbitrary value that should be under 10 seconds, which is the default value for auto refresh.
  protected _timeout$ = timer(8_000).pipe(
    mergeMap(() => throwError(() => new Error('gRPC Timeout')))
  );

  protected _createTimeFilter(value: number): TimeFilter {
    return {
      nanos: 0,
      seconds: (value / 1000).toString(),
    };
  }
}
