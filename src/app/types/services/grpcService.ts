import { ApplicationsClient, CancelSessionResponse, CancelTasksResponse, CountTasksByStatusResponse, GetPartitionResponse, GetResultResponse, GetSessionResponse, GetTaskResponse, ListApplicationsResponse, ListPartitionsResponse, ListResultsResponse, ListSessionsResponse, ListTasksResponse, PartitionsClient, ResultsClient, SessionsClient, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { Observable } from 'rxjs';
import { ApplicationRawFieldKey } from '@app/applications/types';
import { FiltersEnums, FiltersOptionsEnums } from '@app/dashboard/types';
import { PartitionRawFieldKey } from '@app/partitions/types';
import { ResultRawFieldKey } from '@app/results/types';
import { SessionRawFieldKey } from '@app/sessions/types';
import { TaskSummaryFieldKey } from '@app/tasks/types';
import { UtilsService } from '@services/utils.service';
import { IndexListFilters, IndexListOptions } from '../data';
import { RawFilters } from '../filters';

type GrpcClient = TasksClient | ApplicationsClient | ResultsClient | SessionsClient | PartitionsClient;
type ListResponse = ListTasksResponse | ListApplicationsResponse | ListResultsResponse | ListSessionsResponse | ListPartitionsResponse;
type GetResponse = GetTaskResponse | GetPartitionResponse | GetResultResponse | GetSessionResponse;
type CancelResponse = CancelSessionResponse | CancelTasksResponse;
type CountByStatusResponse = CountTasksByStatusResponse;
type DataFieldKey = SessionRawFieldKey | TaskSummaryFieldKey | ApplicationRawFieldKey | PartitionRawFieldKey | ResultRawFieldKey;

export interface GrpcListInterface<C extends GrpcClient, L extends IndexListOptions, E extends IndexListFilters, K extends DataFieldKey, F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  // readonly filterService: DataFiltersService;  NEED TO USE THE FILTERSERVICE INTERFACE HERE
  readonly utilsService: UtilsService<F, O>;
  readonly grpcClient: C;

  readonly sortFields: Record<K, F>;

  list$(options: L, filters: E): Observable<ListResponse>;
}

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

export interface GrpcCountByStatusInterface<R extends RawFilters, F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  readonly utilsService: UtilsService<F, O>;
  readonly grpcClient: GrpcClient;

  countByStatus$(filters: R): Observable<CountByStatusResponse>;
}

