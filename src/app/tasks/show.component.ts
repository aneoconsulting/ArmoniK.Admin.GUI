import { FilterStringOperator, GetTaskResponse, ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Params, RouterModule } from '@angular/router';
import { Field } from '@app/types/column.type';
import { AppShowComponent } from '@app/types/components/show';
import { ShowPageComponent } from '@components/show-page.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
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
  template: `
<app-show-page [id]="id" [data]="data()" [fields]="fields" [optionsFields]="optionsFields" [sharableURL]="sharableURL" [arrays]="arrays" [statuses]="statuses" (refresh)="onRefresh()" [status]="status">
  <div class="title" title>
    <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('tasks')"></mat-icon>
    <span i18n="Page title"> Task </span>
  </div>
  <div class="actions" actions>
    <button mat-button [routerLink]="'/sessions/' + data()?.sessionId">
      <span i18n>See session</span>
      <mat-icon [fontIcon]="getIcon('sessions')" />
    </button>
    <button mat-button [routerLink]="'/results'" [queryParams]="resultsQueryParams">
      <span i18n>See Results</span>
      <mat-icon [fontIcon]="getIcon('results')" />
    </button>
    <button mat-button [routerLink]="'/partitions/' + data()?.options?.partitionId">
      <span i18n>See Partition</span>
      <mat-icon [fontIcon]="getIcon('partitions')" />
    </button>
  </div>
  <div bonus-actions>
    <button mat-flat-button color="accent" (click)="cancel()" [disabled]="canCancel">
      <span i18n>Cancel Task</span>
      <mat-icon [fontIcon]="this.getIcon('cancel')" />
    </button>
  </div>
</app-show-page>
  `,
  styleUrl: '../../inspections.css',
  standalone: true,
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

  private readonly tasksStatusesService = inject(TasksStatusesService);
  private readonly filtersService = inject(FiltersService);

  resultsKey: string = '';
  resultsQueryParams: Params = {};

  canCancel: boolean = false;

  arrays: Field<TaskRaw>[] = this.inspectionService.arrays;
  optionsFields: Field<TaskOptions>[] = this.inspectionService.optionsFields;

  get status() {
    const data: TaskRaw | null = this.data();
    if (data) {
      return this.statuses[data.status];
    }
    return undefined;
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
    if (data) {
      this.createResultQueryParams();
      this.canCancel = !this.tasksStatusesService.taskNotEnded(data.status);
    }
  }
  
  cancel(): void {
    const data = this.data();
    if(data) {
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
