import {
  CancelSessionRequest,
  CancelSessionResponse,
  FilterDateOperator,
  FilterStatusOperator,
  FilterStringOperator,
  GetSessionRequest,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
  SessionFilters,
  SessionRawEnumField,
  SessionsClient,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  GrpcListSessionsParams,
  GrpcParamsService,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcSessionsService extends BaseGrpcService {
  constructor(
    private _sessionsClient: SessionsClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(state: ClrDatagridStateInterface) {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      SessionRawEnumField,
      SortDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<Record<string, unknown>>(state);

    return {
      page,
      pageSize,
      orderBy: orderBy ?? SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
      order,
      filter,
    };
  }

  public createListRequestQueryParams(
    { page, pageSize, orderBy, order, filter }: GrpcListSessionsParams,
    refreshInterval: number
  ): Record<string, unknown> {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      interval: refreshInterval !== 10000 ? refreshInterval : undefined,
      orderBy:
        orderBy !== SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT
          ? orderBy
          : undefined,
      order: order !== SortDirection.SORT_DIRECTION_ASC ? order : undefined,
      sessionId: filter?.['sessionId'],
      status: filter?.['status'],
      createdBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.['createdBefore']
      ),
      createdAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.['createdAfter']
      ),
      cancelledBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.['cancelledBefore']
      ),
      cancelledAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.['cancelledAfter']
      ),
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListSessionsParams): ListSessionsRequest {
    const filters: SessionFilters.AsObject = {
      or: [
        {
          and: [],
        },
      ],
    };

    const keys = Object.keys(filter ?? {});
    const statusKey = 'status';
    const dateKeys = [
      'createdBefore',
      'createdAfter',
      'cancelledBefore',
      'cancelledAfter',
    ];
    for (const key of keys) {
      let fieldId: SessionRawEnumField = 0;
      switch (key) {
        case 'sessionId':
          fieldId = SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID;
          break;
        case 'status':
          fieldId = SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS;
          break;
        case 'createdBefore':
          fieldId = SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT;
          break;
        case 'createdAfter':
          fieldId = SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT;
          break;
        case 'cancelledBefore':
          fieldId = SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT;
          break;
        case 'cancelledAfter':
          fieldId = SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT;
          break;
      }

      if (key === statusKey) {
        filters.or?.[0].and?.push({
          field: {
            sessionRawField: {
              field: fieldId,
            },
          },
          filterStatus: {
            operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
            value: filter?.[key],
          },
        });
      } else if (dateKeys.includes(key)) {
        filters.or?.[0].and?.push({
          field: {
            sessionRawField: {
              field: fieldId,
            },
          },
          filterDate: {
            operator: key.endsWith('Before')
              ? FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL
              : FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
            value: filter?.[key],
          },
        });
      } else {
        filters.or?.[0].and?.push({
          field: {
            sessionRawField: {
              field: fieldId,
            },
          },
          filterString: {
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: filter?.[key],
          },
        });
      }
    }

    return new ListSessionsRequest({
      page,
      pageSize,
      sort: {
        field: {
          sessionRawField: {
            field: orderBy,
          },
        },
        direction: order,
      },
      filters,
    });
  }

  public list$(options: ListSessionsRequest): Observable<ListSessionsResponse> {
    return this._sessionsClient
      .listSessions(options)
      .pipe(takeUntil(this._timeout$));
  }

  public get$(sessionId: string): Observable<GetSessionResponse> {
    const options = new GetSessionRequest({
      sessionId,
    });

    return this._sessionsClient
      .getSession(options)
      .pipe(takeUntil(this._timeout$));
  }

  public cancel$(sessionId: string): Observable<CancelSessionResponse> {
    const options = new CancelSessionRequest({
      sessionId,
    });

    return this._sessionsClient.cancelSession(options);
  }
}
