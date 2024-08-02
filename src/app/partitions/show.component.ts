import { FilterArrayOperator, FilterStringOperator, GetPartitionResponse, SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Params, RouterModule } from '@angular/router';
import { Field } from '@app/types/column.type';
import { AppShowComponent } from '@app/types/components/show';
import { ShowPageComponent } from '@components/show-page.component';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { PartitionsFiltersService } from './services/partitions-filters.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsInspectionService } from './services/partitions-inspection.service';
import { PartitionRaw } from './types';

@Component({
  selector: 'app-partitions-show',
  template: `
<app-show-page [id]="id" [data]="data()" [sharableURL]="sharableURL" [fields]="fields" [arrays]="arrays" (refresh)="onRefresh()">
  <div class="title" title>
    <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('partitions')"></mat-icon>
    <span i18n="Page title">Partition</span>
  </div>
  <div class="actions" actions>
  <button mat-button [routerLink]="'/sessions'" [queryParams]="sessionsQueryParams">
      <span i18n>See Sessions</span>
      <mat-icon [fontIcon]="getIcon('sessions')" />
    </button>
    <button mat-button [routerLink]="'/tasks'" [queryParams]="tasksQueryParams">
      <span i18n>See Tasks</span>
      <mat-icon [fontIcon]="getIcon('tasks')" />
    </button>
  </div>
</app-show-page>
  `,
  styleUrl: '../../inspections.css',
  standalone: true,
  providers: [
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    PartitionsGrpcService,
    PartitionsFiltersService,
    TableService,
    TableURLService,
    TableStorageService,
    NotificationService,
    MatSnackBar,
    FiltersService,
    PartitionsInspectionService,
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowComponent extends AppShowComponent<PartitionRaw, GetPartitionResponse> implements OnInit, OnDestroy {
  readonly grpcService = inject(PartitionsGrpcService);
  readonly inspectionService = inject(PartitionsInspectionService);

  private readonly filtersService = inject(FiltersService);

  sessionsKey: string = '';
  sessionsQueryParams: Params = {};

  tasksKey: string = '';
  tasksQueryParams: Params = {};

  arrays: Field<PartitionRaw>[] = [];

  ngOnInit(): void {
    this.createTasksKey();
    this.createSessionsKey();
    this.arrays = this.inspectionService.arrays;
    this.initInspection();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  createSessionsKey() {
    this.sessionsKey = this.filtersService.createQueryParamsKey<SessionRawEnumField>(0, 'root', FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS, SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS);
  }

  createSessionsQueryParams() {
    this.sessionsQueryParams[this.sessionsKey] = this.data()?.id;
  }
  
  createTasksKey() {
    this.tasksKey = this.filtersService.createQueryParamsKey<TaskOptionEnumField>(0, 'options', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID);
  }

  createTasksQueryParams() {
    this.tasksQueryParams[this.tasksKey] = this.data()?.id;
  }

  getDataFromResponse(data: GetPartitionResponse): PartitionRaw | undefined {
    return data.partition;
  }

  afterDataFetching(): void {
    this.createSessionsQueryParams();
    this.createTasksQueryParams();
  }
}
