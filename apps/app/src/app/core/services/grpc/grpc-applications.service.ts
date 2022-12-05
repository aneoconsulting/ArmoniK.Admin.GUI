import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import {
  ListApplicationsRequest,
  ListApplicationsResponse,
} from '../../types/proto/applications-common.pb';
import { ApplicationsClient } from '../../types/proto/applications-service.pbsc';
import { BaseGrpcService } from './base-grpc.service';

@Injectable()
export class GrpcApplicationsService extends BaseGrpcService {
  constructor(private _applicationsService: ApplicationsClient) {
    super();
  }

  /**
   * Get a list of applications
   *
   * @param params
   *
   * @returns Observable<ListApplicationsResponse>
   */
  public list$(params: HttpParams): Observable<ListApplicationsResponse> {
    const options = new ListApplicationsRequest({
      page: Number(params.get('page')) || 0,
      pageSize: Number(params.get('pageSize')) || 10,
      sort: {
        field: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
        direction: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      },
    });

    return this._applicationsService
      .listApplications(options)
      .pipe(takeUntil(this._timeout$));
  }
}
