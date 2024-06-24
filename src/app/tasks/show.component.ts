import { FilterStringOperator, GetTaskResponse, ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { AppShowComponent, ShowActionButton, ShowActionInterface, ShowCancellableInterface } from '@app/types/components/show';
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
import { TasksStatusesService } from './services/tasks-statuses.service';
import { TaskRaw } from './types';

@Component({
  selector: 'app-tasks-show',
  template: `
<app-show-page [id]="id" [data]="data()" [sharableURL]="sharableURL" [statuses]="statuses" [actionsButton]="actionButtons" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('tasks')"></mat-icon>
  <span i18n="Page title"> Task </span>
</app-show-page>
  `,
  styles: [`
  `],
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
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowComponent extends AppShowComponent<TaskRaw, GetTaskResponse> implements OnInit, AfterViewInit, ShowCancellableInterface, ShowActionInterface, OnDestroy {

  cancel$ = new Subject<void>();

  private readonly tasksStatusesService = inject(TasksStatusesService);
  private readonly filtersService = inject(FiltersService);
  readonly grpcService = inject(TasksGrpcService);

  canCancel$ = new Subject<boolean>();

  actionButtons: ShowActionButton[] = [
    {
      id: 'session',
      name: $localize`See session`,
      icon: this.getIcon('sessions'),
      area: 'left',
      link: '/sessions',
    },
    {
      id: 'results',
      name: $localize`See results`,
      icon: this.getIcon('results'),
      area: 'left',
      link: '/results',
      queryParams: {}
    },
    {
      id: 'partition',
      name: $localize`See partition`,
      icon: this.getIcon('partitions'),
      area: 'left',
      link: '/partitions',
    },
    {
      id: 'cancel',
      name: $localize`Cancel task`,
      icon: this.getIcon('cancel'),
      color: 'accent',
      area: 'right',
      action$: this.cancel$,
      disabled: this.canCancel$
    }
  ];

  ngOnInit(): void {
    this.sharableURL = this.getSharableUrl();
  }

  ngAfterViewInit(): void {
    this.subscribeToData();
    this.getIdByRoute();
    const cancelSubscription = this.cancel$.subscribe(() => this.cancel());
    this.subscriptions.add(cancelSubscription);
    this.refresh.next();
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
      this.setLink('session', 'sessions', data.sessionId);
      if (data.options) {
        this.setLink('partition', 'partitions', data.options.partitionId);
      }
      this.filtersService.createFilterQueryParams(this.actionButtons, 'results', this.resultsKey(), data.id);
      this.canCancel$.next(this.tasksStatusesService.taskNotEnded(data.status));
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

  resultsKey() {
    return this.filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);
  }

  setLink(actionId: string, baseLink: string, id: string) {
    const index = this.actionButtons.findIndex(element => element.id === actionId);
    if (index !== -1) {
      this.actionButtons[index].link = `/${baseLink}/${id}`;
    }
  }

  get statuses() {
    return this.tasksStatusesService.statuses;
  }
}
