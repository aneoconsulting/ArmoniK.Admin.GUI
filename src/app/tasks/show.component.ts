import { FilterStringOperator, GetTaskResponse, ResultRawEnumField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Params, RouterModule } from '@angular/router';
import { Field } from '@app/types/column.type';
import { AppShowComponent } from '@app/types/components/show';
import { StatusLabelColor, StatusService } from '@app/types/status';
import { ShowPageComponent } from '@components/show-page.component';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { TasksFiltersService } from './services/tasks-filters.service';
import { TasksGrpcService } from './services/tasks-grpc.service';
import { TasksInspectionService } from './services/tasks-inspection.service';
import { TasksStatusesService } from './services/tasks-statuses.service';
import { TaskOptions, TaskRaw } from './types';

@Component({
  selector: 'app-tasks-show',
  templateUrl: 'show.component.html',
  styleUrl: '../../inspections.scss',
  providers: [
    IconsService,
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    TasksGrpcService,
    TasksStatusesService,
    TableService,
    TableStorageService,
    TableURLService,
    TasksFiltersService,
    NotificationService,
    MatSnackBar,
    FiltersService,
    GrpcSortFieldService,
    TasksInspectionService,
    DefaultConfigService,
    StorageService,
    {
      provide: StatusService,
      useClass: TasksStatusesService,
    },
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowComponent extends AppShowComponent<TaskRaw, GetTaskResponse> implements OnInit, OnDestroy {

  readonly grpcService = inject(TasksGrpcService);
  readonly inspectionService = inject(TasksInspectionService);

  private readonly tasksStatusesService = inject(StatusService) as TasksStatusesService;
  private readonly filtersService = inject(FiltersService);

  private _status: StatusLabelColor | undefined;

  resultsKey: string = '';
  resultsQueryParams: Params = {};

  canCancel: boolean = false;

  arrays: Field<TaskRaw>[] = this.inspectionService.arrays;
  optionsFields: Field<TaskOptions>[] = this.inspectionService.optionsFields;

  get status(): StatusLabelColor | undefined {
    return this._status;
  }

  set status(value: TaskStatus | undefined) {
    this._status = value ? this.statuses[value] : undefined;
  }

  ngOnInit(): void {
    this.resultsKey = this.filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);
    this.initInspection();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetTaskResponse): TaskRaw | undefined {
    return data.task;
  }

  afterDataFetching(): void {
    const data = this.data();
    this.status = data?.status;
    if (data) {
      data.parentTaskIds = data.parentTaskIds.filter(taskId => taskId !== data.sessionId);
      this.createResultQueryParams();
      this.canCancel = !this.tasksStatusesService.taskNotEnded(data.status);
    }
  }

  cancel(): void {
    const data = this.data();
    if (data) {
      this.grpcService.cancel$([data.id]).subscribe({
        complete: () => {
          this.success('Task canceled');
          this.refresh.next();
        },
        error: (error) => {
          this.handleError(error);
        },
      });
    }
  }

  createResultQueryParams() {
    this.resultsQueryParams[this.resultsKey] = this.data()?.id;
  }

  get statuses() {
    return this.tasksStatusesService.statuses;
  }
}
