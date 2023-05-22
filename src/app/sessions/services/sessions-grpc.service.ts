import { CancelSessionRequest, CancelSessionResponse, GetSessionRequest, GetSessionResponse, ListSessionsRequest, ListSessionsResponse, SessionStatus, SessionsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { AppGrpcService } from '@app/types/services';
import { UtilsService } from '@services/utils.service';
import { SessionRaw, SessionRawFilter, SessionRawKeyField, SessionRawListOptions } from '../types';

@Injectable()
export class SessionsGrpcService implements AppGrpcService<SessionRaw> {
  readonly sortDirections: Record<SortDirection, ListSessionsRequest.OrderDirection> = {
    'asc': ListSessionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
    'desc': ListSessionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
    '': ListSessionsRequest.OrderDirection.ORDER_DIRECTION_ASC
  };

  // FIXME: Missing some fields to be sorted (every unspecified field)
  readonly sortFields: Record<SessionRawKeyField, ListSessionsRequest.OrderByField> = {
    'sessionId': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_SESSION_ID,
    'applicationName': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_UNSPECIFIED,
    'applicationVersion': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_UNSPECIFIED,
    'status': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_STATUS,
    'createdAt': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
    'startedAt': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_UNSPECIFIED,
    'canceledAt': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_UNSPECIFIED,
    'options': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_UNSPECIFIED,
    'partitionsIds': ListSessionsRequest.OrderByField.ORDER_BY_FIELD_UNSPECIFIED,
  };

  constructor(
    private _sessionsClient: SessionsClient,
    private _utilsService: UtilsService<SessionRaw>
  ) {}

  list$(options: SessionRawListOptions, filters: SessionRawFilter[]): Observable<ListSessionsResponse> {
    const findFilter = this._utilsService.findFilter;
    const convertFilterValue = this._utilsService.convertFilterValue;
    const convertFilterValueToNumber = this._utilsService.convertFilterValueToNumber;

    const listSessionsRequest = new ListSessionsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        field: this.sortFields[options.sort.active] ?? ListSessionsRequest.OrderByField.ORDER_BY_FIELD_SESSION_ID
      },
      filter: {
        sessionId: convertFilterValue(findFilter(filters, 'sessionId')),
        applicationName: convertFilterValue(findFilter(filters, 'applicationName')),
        applicationVersion: convertFilterValue(findFilter(filters, 'applicationVersion')),
        status: SessionStatus.SESSION_STATUS_UNSPECIFIED,
      }
    });

    return this._sessionsClient.listSessions(listSessionsRequest);
  }

  get$(sessionId: string): Observable<GetSessionResponse> {
    const getSessionRequest = new GetSessionRequest({
      sessionId
    });

    return this._sessionsClient.getSession(getSessionRequest);
  }

  cancel$(sessionId: string): Observable<CancelSessionResponse> {
    const cancelSessionRequest = new CancelSessionRequest({
      sessionId
    });

    return this._sessionsClient.cancelSession(cancelSessionRequest);
  }
}
