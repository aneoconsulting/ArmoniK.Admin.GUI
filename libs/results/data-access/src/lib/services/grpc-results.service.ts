import {
  FilterDateOperator,
  FilterStatusOperator,
  FilterStringOperator,
  ListResultsRequest,
  ListResultsResponse,
  ResultFilters,
  ResultRawEnumField,
  ResultsClient,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  GrpcListResultsParams,
  GrpcParamsService,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcResultsService extends BaseGrpcService {
  constructor(
    private _resultsClient: ResultsClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(
    state: ClrDatagridStateInterface
  ): GrpcListResultsParams {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      ResultRawEnumField,
      SortDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<Record<string, unknown>>(
        state
      );

    return {
      page,
      pageSize,
      orderBy: orderBy ?? ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
      order,
      filter,
    };
  }

  public createListRequestQueryParams(
    { page, pageSize, orderBy, order, filter }: GrpcListResultsParams,
    refreshInterval: number
  ): Record<string, unknown> {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      interval: refreshInterval !== 10000 ? refreshInterval : undefined,
      orderBy:
        orderBy !== ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT
          ? orderBy
          : undefined,
      order: order !== SortDirection.SORT_DIRECTION_ASC ? order : undefined,
      name: filter?.['name'],
      ownerTaskId: filter?.['ownerTaskId'],
      sessionId: filter?.['sessionId'],
      status: filter?.['status'],
      createdBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.['createdBefore']
      ),
      createdAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.['createdAfter']
      ),
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListResultsParams): ListResultsRequest {
    const filters: ResultFilters.AsObject = {
      or: [
        {
          and: [],
        },
      ],
    };

    const keys = Object.keys(filter ?? {});
    const statusKey = 'status';
    const dateKeys = ['createdBefore', 'createdAfter'];
    for (const key of keys) {
      let fieldId: ResultRawEnumField = 0;
      switch (key) {
        case 'name':
          fieldId = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME;
          break;
        case 'ownerTaskId':
          fieldId = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID;
          break;
        case 'sessionId':
          fieldId = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID;
          break;
        case 'status':
          fieldId = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS;
          break;
        case 'createdBefore':
          fieldId = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT;
          break;
        case 'createdAfter':
          fieldId = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT;
          break;
      }

      if (key === statusKey) {
        filters.or?.[0].and?.push({
          field: {
            resultRawField: {
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
            resultRawField: {
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
            resultRawField: {
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

    return new ListResultsRequest({
      page,
      pageSize,
      sort: {
        field: {
          resultRawField: {
            field: orderBy,
          },
        },
        direction: order,
      },
      filters,
    });
  }

  public list$(options: ListResultsRequest): Observable<ListResultsResponse> {
    return this._resultsClient
      .listResults(options)
      .pipe(takeUntil(this._timeout$));
  }
}
