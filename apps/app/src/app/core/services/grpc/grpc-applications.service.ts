import { Injectable } from '@angular/core';
import { mergeMap, Observable, takeUntil, throwError, timer } from 'rxjs';
import { GrpcParams } from '../../types/grpc-params.type';
import {
  ListApplicationsRequest,
  ListApplicationsResponse,
} from '../../types/proto/applications-common.pb';
import { ApplicationsClient } from '../../types/proto/applications-service.pbsc';

@Injectable()
export class GrpcApplicationsService {
  private _timeout$ = timer(8_000).pipe(
    mergeMap(() => throwError(() => new Error('gRPC Timeout')))
  );

  constructor(private _applicationsService: ApplicationsClient) {}

  /**
   * Get a list of applications
   *
   * @param params
   *
   * @returns Observable<ListApplicationsResponse>
   */
  public list$(
    params: GrpcParams<
      ListApplicationsRequest.OrderByField,
      ListApplicationsRequest.OrderDirection
    >
  ): Observable<ListApplicationsResponse> {
    const options = new ListApplicationsRequest({
      page: params.page || 0,
      pageSize: params.pageSize || 10,
      sort: {
        field:
          params.orderBy ||
          ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
        direction:
          params.order ||
          ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: {},
    });

    return this._applicationsService
      .listApplications(options)
      .pipe(takeUntil(this._timeout$));
  }
}
