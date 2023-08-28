import {
  ApplicationFilters,
  ApplicationRawEnumField,
  ApplicationsClient,
  CountTasksByStatusRequest,
  CountTasksByStatusResponse,
  FilterStringOperator,
  ListApplicationsRequest,
  ListApplicationsResponse,
  SortDirection,
  TaskOptionEnumField,
  TasksClient,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  GrpcListApplicationsParams,
  GrpcParamsService,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcApplicationsService extends BaseGrpcService {
  constructor(
    private _applicationsClient: ApplicationsClient,
    private _tasksClient: TasksClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(
    state: ClrDatagridStateInterface
  ): GrpcListApplicationsParams {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      ApplicationRawEnumField,
      SortDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<Record<string, unknown>>(state);

    return {
      page,
      pageSize,
      orderBy: [
        orderBy ?? ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
      ],
      order,
      filter,
    };
  }

  public createListRequestQueryParams(
    { page, pageSize, orderBy, order, filter }: GrpcListApplicationsParams,
    refreshInterval: number
  ): Record<string, unknown> {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      interval: refreshInterval !== 10000 ? refreshInterval : undefined,
      orderBy: !orderBy.includes(
        ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME
      )
        ? orderBy
        : undefined,
      order: order !== SortDirection.SORT_DIRECTION_ASC ? order : undefined,
      ...filter,
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListApplicationsParams): ListApplicationsRequest {
    const filters: ApplicationFilters.AsObject = {
      or: [
        {
          and: [],
        },
      ],
    };

    const keys = Object.keys(filter ?? {});
    for (const key of keys) {
      let fieldId: ApplicationRawEnumField = 0;
      switch (key) {
        case 'name':
          fieldId = ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME;
          break;
        case 'version':
          fieldId = ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION;
          break;
        case 'namespace':
          fieldId =
            ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE;
          break;
        case 'service':
          fieldId = ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE;
          break;
      }

      filters.or?.[0].and?.push({
        field: {
          applicationField: {
            field: fieldId,
          },
        },
        filterString: {
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: filter?.[key],
        },
      });
    }

    return new ListApplicationsRequest({
      page,
      pageSize,
      sort: {
        fields: [
          ...orderBy.map((field) => {
            return { applicationField: { field } };
          }),
        ],
        direction: order,
      },
      filters,
    });
  }

  public list$(
    options: ListApplicationsRequest
  ): Observable<ListApplicationsResponse> {
    return this._applicationsClient
      .listApplications(options)
      .pipe(takeUntil(this._timeout$));
  }

  public countTasksByStatus$({
    name,
    version,
  }: {
    name: string;
    version: string;
  }): Observable<CountTasksByStatusResponse> {
    const options = new CountTasksByStatusRequest({
      filters: {
        or: [
          {
            and: [
              {
                field: {
                  taskOptionField: {
                    field:
                      TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
                  },
                },
                filterString: {
                  operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
                  value: name,
                },
              },
              {
                field: {
                  taskOptionField: {
                    field:
                      TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
                  },
                },
                filterString: {
                  operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
                  value: version,
                },
              },
            ],
          },
        ],
      },
    });

    return this._tasksClient
      .countTasksByStatus(options)
      .pipe(takeUntil(this._timeout$));
  }
}
