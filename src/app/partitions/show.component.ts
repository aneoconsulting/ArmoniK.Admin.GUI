import { FilterArrayOperator, FilterStringOperator, GetPartitionResponse, SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppShowComponent, ShowActionButton, ShowActionInterface } from '@app/types/components/show';
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
import { PartitionRaw } from './types';

@Component({
  selector: 'app-partitions-show',
  template: `
<app-show-page [id]="id" [data]="data()" [sharableURL]="sharableURL" [actionsButton]="actionButtons" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('partitions')"></mat-icon>
  <span i18n="Page title">Partition</span>
</app-show-page>
  `,
  styles: [`
  `],
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
    FiltersService
  ],
  imports: [
    ShowPageComponent,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowComponent extends AppShowComponent<PartitionRaw, GetPartitionResponse> implements OnInit, AfterViewInit, ShowActionInterface, OnDestroy {
  readonly grpcService = inject(PartitionsGrpcService);
  private readonly filtersService = inject(FiltersService);

  actionButtons: ShowActionButton[] = [
    {
      id: 'sessions',
      name: $localize`See sessions`,
      icon: this.getIcon('sessions'),
      link: '/sessions',
      queryParams: {},
      area: 'left'
    },
    {
      id: 'tasks',
      name: $localize`See tasks`,
      icon: this.getIcon('tasks'),
      link: '/tasks',
      queryParams: {},
      area: 'left'
    }
  ];

  ngOnInit(): void {
    this.getIdByRoute();
    this.sharableURL = this.getSharableUrl();
  }

  ngAfterViewInit(): void {
    this.subscribeToData();
    this.refresh.next();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetPartitionResponse): PartitionRaw | undefined {
    return data.partition;
  }

  afterDataFetching(): void {
    const data = this.data();
    if (data) {
      this.filtersService.createFilterQueryParams(this.actionButtons, 'sessions', this.partitionsKey, data.id);
      this.filtersService.createFilterQueryParams(this.actionButtons, 'tasks', this.tasksKey, data.id);
    }
  }

  get partitionsKey() {
    return this.filtersService.createQueryParamsKey<SessionRawEnumField>(0, 'root', FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS, SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS);
  }

  get tasksKey() {
    return this.filtersService.createQueryParamsKey<TaskOptionEnumField>(0, 'options', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID);
  }
}
