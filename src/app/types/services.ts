// import { SortDirection as ArmoniKSortDirection } from '@aneoconsultingfr/armonik.api.angular';
// import { SortDirection } from '@angular/material/sort';
// import { Observable } from 'rxjs';
// import { ColumnKey, FieldKey } from './data';
// import { Filter, FiltersOr } from './filters';
// import { ListOptions } from './options';

import { ApplicationsGrpcService } from '@app/applications/services/applications-grpc.service';
import { PartitionsGrpcService } from '@app/partitions/services/partitions-grpc.service';
import { ResultsGrpcService } from '@app/results/services/results-grpc.service';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsGrpcService } from '@app/sessions/services/sessions-grpc.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { Status } from './data';

export interface StatusesServiceI<S extends Status> {
  readonly statuses: Record<S, string>;
  statusToLabel(status: S): string;
}

export interface CancelStatusesServiceI<S extends Status> extends StatusesServiceI<S> {
  notEnded(taskStatus: S): boolean;
}

export type StatusesService = SessionsStatusesService | TasksStatusesService | ResultsStatusesService;
export type GrpcService = TasksGrpcService | SessionsGrpcService | ApplicationsGrpcService | PartitionsGrpcService | ResultsGrpcService;