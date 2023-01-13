import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  CancelTasksRequest,
  CancelTasksResponse,
  GetTaskRequest,
  GetTaskResponse,
  GrpcListTasksParams,
  GrpcParamsService,
  ListTasksRequest,
  ListTasksResponse,
  TasksClient,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcTasksService extends BaseGrpcService {
  constructor(
    private _tasksClient: TasksClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(
    state: ClrDatagridStateInterface
  ): GrpcListTasksParams {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      ListTasksRequest.OrderByField,
      ListTasksRequest.OrderDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<ListTasksRequest.Filter.AsObject>(
        state
      );

    return {
      page,
      pageSize,
      orderBy:
        orderBy ?? ListTasksRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
      order,
      filter,
    };
  }

  public createListRequestQueryParams({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListTasksParams) {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? page : undefined,
      orderBy:
        orderBy !== ListTasksRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT
          ? orderBy
          : undefined,
      order:
        order !== ListTasksRequest.OrderDirection.ORDER_DIRECTION_ASC
          ? order
          : undefined,
      ...filter,
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListTasksParams): ListTasksRequest {
    return new ListTasksRequest({
      page,
      pageSize,
      sort: {
        field: orderBy,
        direction: order,
      },
      filter,
    });
  }

  public list$(options: ListTasksRequest): Observable<ListTasksResponse> {
    return this._tasksClient.listTasks(options).pipe(takeUntil(this._timeout$));
  }

  public get$(taskId: string): Observable<GetTaskResponse> {
    const options = new GetTaskRequest({
      taskId,
    });

    return this._tasksClient.getTask(options).pipe(takeUntil(this._timeout$));
  }

  public cancel$(taskIds: string[]): Observable<CancelTasksResponse> {
    const options = new CancelTasksRequest({
      taskIds,
    });

    return this._tasksClient
      .cancelTasks(options)
      .pipe(takeUntil(this._timeout$));
  }
}
