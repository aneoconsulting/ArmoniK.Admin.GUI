import { Injectable } from '@angular/core';
import {
  ApplicationsClient,
  BaseGrpcService,
  GrpcParams,
  ListApplicationsRequest,
  ListApplicationsResponse,
} from '@armonik.admin.gui/shared/data-access';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcApplicationsService extends BaseGrpcService {
  constructor(private _applicationsClient: ApplicationsClient) {
    super();
  }

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
    });

    return this._applicationsClient
      .listApplications(options)
      .pipe(takeUntil(this._timeout$));
  }
}
