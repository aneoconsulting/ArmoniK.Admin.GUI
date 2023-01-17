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

  public urlToGrpcParams(
    params: Record<string, string | number>
  ): GrpcParams<
      ListApplicationsRequest.OrderByField,
      ListApplicationsRequest.OrderDirection,
      ListApplicationsRequest.Filter.AsObject
    > {
    const grpcParams: GrpcParams<
      ListApplicationsRequest.OrderByField,
      ListApplicationsRequest.OrderDirection,
      ListApplicationsRequest.Filter.AsObject
    > = {
    };
    const filter = {
      name: '',
      namespace:'',
      service: '',
      version: ''
    }
    console.log(params);
    for (const [key, value] of Object.entries(params)) {
      switch(key) {
        case 'page': {
          grpcParams.page = value as number;
          break;
        }
        case 'pageSize': {
          grpcParams.pageSize = value as number;
          break;
        }
        case 'order': {
          grpcParams.order = value as number;
          break;
        }
        case 'orderBy': {
          grpcParams.orderBy = value as number;
          break;
        }
        case 'name':{
          filter.name = value as string;
          break;
        }
        case 'namespace': {
          filter.namespace = value as string;
          break;
        }
        case 'version': {
          filter.version = value as string;
          break;
        }
        case 'service': {
          filter.service = value as string;
          break;
        }
      }
    }
    grpcParams.filter = filter;
    return grpcParams;
  }

  public list$(
    params: GrpcParams<
      ListApplicationsRequest.OrderByField,
      ListApplicationsRequest.OrderDirection,
      ListApplicationsRequest.Filter.AsObject
    >
  ): Observable<ListApplicationsResponse> {
    // console.log(params)
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
      filter: {
        name: params.filter?.name || '',
        namespace: params.filter?.namespace || '',
        service: params.filter?.service || '',
        version: params.filter?.version || '',
      },
    });

    // console.log(options)

    return this._applicationsClient
      .listApplications(options)
      .pipe(takeUntil(this._timeout$));
  }
}
