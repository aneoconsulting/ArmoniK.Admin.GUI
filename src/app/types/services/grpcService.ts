import { ApplicationFilterField, ApplicationsClient, CancelSessionResponse, CancelTasksResponse, CountTasksByStatusResponse, GetPartitionResponse, GetResultResponse, GetSessionResponse, GetTaskResponse, PartitionFilterField, PartitionsClient, ResultFilterField, ResultsClient, SessionFilterField, SessionsClient, TaskFilterField, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationRawFieldKey } from '@app/applications/types';
import { FiltersEnums, FiltersOptionsEnums } from '@app/dashboard/types';
import { PartitionRawFieldKey } from '@app/partitions/types';
import { ResultRawFieldKey } from '@app/results/types';
import { SessionRawFieldKey } from '@app/sessions/types';
import { TaskSummaryFieldKey } from '@app/tasks/types';
import { FilterField, sortDirections } from '@services/grpc-build-request.service';
import { UtilsService } from '@services/utils.service';
import { FiltersServiceInterface } from './filtersService';
import { GrpcResponse, IndexListOptions } from '../data';
import { FilterDefinition } from '../filter-definition';
import { Filter, FilterType, FiltersAnd, FiltersOr, RawFilters } from '../filters';

export type GrpcClient = TasksClient | ApplicationsClient | ResultsClient | SessionsClient | PartitionsClient;
export type GetResponse = GetTaskResponse | GetPartitionResponse | GetResultResponse | GetSessionResponse;
export type CancelResponse = CancelSessionResponse | CancelTasksResponse;
export type CountByStatusResponse = CountTasksByStatusResponse;
export type DataFieldKey = SessionRawFieldKey | TaskSummaryFieldKey | ApplicationRawFieldKey | PartitionRawFieldKey | ResultRawFieldKey;
export type RequestFilterField = TaskFilterField.AsObject | SessionFilterField.AsObject | PartitionFilterField.AsObject | ApplicationFilterField.AsObject | ResultFilterField.AsObject;

export type ListDefaultSortField = {
  field: object
};

export type ListApplicationSortField = {
  fields: object[]
};

export type ListRequestSortField = ListApplicationSortField | ListDefaultSortField;

export interface GrpcGetInterface<R extends GetResponse> {
  readonly grpcClient: GrpcClient;
  get$(id: string): Observable<R>;
}

export interface GrpcCancelInterface<R extends CancelResponse> {
  readonly grpcClient: GrpcClient;
  cancel$(id: string): Observable<R>;
}

export interface GrpcCancelManyInterface<R extends CancelResponse> {
  readonly grpcClient: GrpcClient;
  cancel$(ids: string[]): Observable<R>;
}

export interface GrpcCountByStatusInterface<R extends RawFilters> {
  readonly grpcClient: GrpcClient;
  countByStatus$(filters: R): Observable<CountByStatusResponse>;
}

export abstract class GrpcTableService<K extends DataFieldKey, O extends IndexListOptions, F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> {
  abstract readonly sortFields: Record<K, F>;
  
  abstract readonly grpcClient: GrpcClient;
  abstract readonly filterService: FiltersServiceInterface<RawFilters, F>;

  readonly utilsService = inject(UtilsService<F, FO>);
  
  /**
   * Required function to list data for a table. You want to create a ListRequest object with the `createListRequest` function.
   * 
   * Example:
   * ```ts
   * list$(options: TaskSummaryListOptions, filters: TaskSummaryFilters): Observable<ListTasksResponse> {
   *   const listTasksRequest = new ListTasksRequest(this.createListRequest(options, filters));
   * 
   *   return this.grpcClient.listTasks(listTasksRequest);
   * }
   * ```
   */
  abstract list$(options: O, filters: FiltersOr<F, FO>): Observable<GrpcResponse>;

  /**
   * The sort field can be either an option, custom or basic enum field.
   * Since the parent class cannot make the difference between two enum field (for example taskSummaryField and sessionRawField), you have to implement it yourself.
   */
  abstract createSortField(field: K): ListRequestSortField;

  /**
   * The filter field can be either an option, custom or basic enum field.
   * Since the parent class cannot make the difference between two enum field (for example taskSummaryField and sessionRawField), you have to implement it yourself.
   */
  abstract createFilterField(field: F | FO | string, isForRoot?: boolean, isCustom?: boolean): FilterField;

  /**
   * Transform a GUI filter into a gRPC ArmoniK filter. Needed for listing requests.
   */
  abstract buildFilter(type: FilterType, filterField: FilterField, filter: Filter<F, FO>): RequestFilterField;

  /**
   * Creates the gRPC list request needed to list the required data.
   * Will transform filters before making the request. 
   */
  createListRequest(options: O, filters: FiltersOr<F, FO>) {
    const requestFilter = this.createFilters(filters, this.filterService.filtersDefinitions as FilterDefinition<F, FO>[]);
    const sortField = this.createSortField(options.sort.active as K);

    return {
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: sortDirections[options.sort.direction],
        ...sortField,
      },
      filters: requestFilter
    };
  }

  /**
   * Used to create a group of lines (OR).
   */
  createFilters(filters: FiltersOr<F, FO>, filtersDefinitions: FilterDefinition<F, FO>[]) {
    const filtersOr = [];

    for (const filter of filters) {
      const filtersAnd = this.createFiltersAnd(filter, filtersDefinitions);

      if (filtersAnd.and && filtersAnd.and.length > 0) {
        filtersOr.push(filtersAnd);
      }
    }

    return {
      or: filtersOr
    };
  }

  /**
   * Used to create a line of filters (AND).
   */
  private createFiltersAnd(filters: FiltersAnd<F, FO>, filtersDefinitions: FilterDefinition<F, FO>[]) {
    const filtersAnd = [];

    for (const filter of filters) {
      const filterField = this.createFilterObject(filter, filtersDefinitions);

      if (filterField) {
        filtersAnd.push(filterField);
      }
    }

    return {
      and: filtersAnd
    };
  }

  /**
   * Used to define a filter field.
   */
  private createFilterObject(filter: Filter<F, FO>, filtersDefinitions: FilterDefinition<F, FO>[]) {
    if (filter.field === null || filter.value === null || filter.operator === null) {
      return null;
    }

    const type = this.utilsService.recoverType(filter, filtersDefinitions);
    const field = this.recoverField(filter, filtersDefinitions);
    const filterField = this.createFilterField(field, this.isForRoot(filter, filtersDefinitions), this.isCustom(filter));

    return this.buildFilter(type, filterField, filter);
  }

  /**
   * Check if a filter is used for a root property of the table. 
   * @param filter 
   * @param filtersDefinitions 
   * @returns true if root, false otherwise
   */
  private isForRoot(filter: Filter<F, FO>, filtersDefinitions: FilterDefinition<F, FO>[]): boolean {
    return !this.isCustom(filter) && this.utilsService.recoverFilterDefinition(filter, filtersDefinitions).for === 'root';
  }

  /**
   * Check if a filter is used for a custom column of the table.
   * @param filter
   * @returns true if custom, false otherwise
   */
  private isCustom(filter: Filter<F, FO>): boolean {
    return filter.for === 'custom';
  }

  /**
   * Recover the field of a filter definition using the filter.
   */
  private recoverField(filter: Filter<F, FO>, filtersDefinitions: FilterDefinition<F, FO>[]): F | FO | string {
    if(filter.for !== 'custom') {
      const filterDefinition = this.utilsService.recoverFilterDefinition(filter, filtersDefinitions);
      return filterDefinition.field;
    } else {
      return (filter.field as string);
    }
  }
}

