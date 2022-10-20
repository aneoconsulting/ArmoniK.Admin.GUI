import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ListSessionsRequest,
  ListSessionsResponse,
} from '../../types/proto/sessions-common.pb';
import { SessionsClient } from '../../types/proto/sessions-service.pbsc';

@Injectable()
export class GrpcSessionsService {
  constructor(private _sessionsClient: SessionsClient) {}

  public list$(): Observable<ListSessionsResponse> {
    const options = new ListSessionsRequest({
      page: 0,
      pageSize: 10,
      sort: {
        field: ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction: ListSessionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: {},
    });

    return this._sessionsClient.listSessions(options);
  }
}
