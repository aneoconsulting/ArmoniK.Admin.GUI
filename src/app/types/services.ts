// import { SortDirection as ArmoniKSortDirection } from '@aneoconsultingfr/armonik.api.angular';
// import { SortDirection } from '@angular/material/sort';
// import { Observable } from 'rxjs';
// import { ColumnKey, FieldKey } from './data';
// import { Filter, FiltersOr } from './filters';
// import { ListOptions } from './options';
import { ApplicationsFiltersService } from '@app/applications/services/applications-filters.service';
import { ApplicationsGrpcService } from '@app/applications/services/applications-grpc.service';
import { ApplicationsIndexService } from '@app/applications/services/applications-index.service';
import { PartitionsFiltersService } from '@app/partitions/services/partitions-filters.service';
import { PartitionsGrpcService } from '@app/partitions/services/partitions-grpc.service';
import { PartitionsIndexService } from '@app/partitions/services/partitions-index.service';
import { ResultsFiltersService } from '@app/results/services/results-filters.service';
import { ResultsGrpcService } from '@app/results/services/results-grpc.service';
import { ResultsIndexService } from '@app/results/services/results-index.service';
import { SessionsFiltersService } from '@app/sessions/services/sessions-filters.service';
import { SessionsGrpcService } from '@app/sessions/services/sessions-grpc.service';
import { SessionsIndexService } from '@app/sessions/services/sessions-index.service';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';


export type GrpcService = TasksGrpcService | SessionsGrpcService | ApplicationsGrpcService | PartitionsGrpcService | ResultsGrpcService;

export type DataFiltersService = SessionsFiltersService | TasksFiltersService | PartitionsFiltersService | ApplicationsFiltersService | ResultsFiltersService;
export type IndexService = TasksIndexService | SessionsIndexService | PartitionsIndexService | ApplicationsIndexService | ResultsIndexService;