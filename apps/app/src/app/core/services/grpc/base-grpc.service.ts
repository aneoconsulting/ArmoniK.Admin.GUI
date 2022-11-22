import { mergeMap, throwError, timer } from 'rxjs';

export class BaseGrpc {
  // Timeout for gRPC requests. 8 seconds is an arbitrary value that should be under 10 seconds, which is the default value for auto refresh.
  protected _timeout$ = timer(8_000).pipe(
    mergeMap(() => throwError(() => new Error('gRPC Timeout')))
  );
}
