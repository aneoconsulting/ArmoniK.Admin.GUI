import { FilterStringOperator, ResultRawEnumField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject, map, switchMap } from 'rxjs';
import { ShowActionButton, TaskShowComponent } from '@app/types/components/show';
import { Page } from '@app/types/pages';
import { ShowPageComponent } from '@components/show-page.component';
import { FiltersService } from '@services/filters.service';
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
import { TasksIndexService } from './services/tasks-index.service';
import { TasksStatusesService } from './services/tasks-statuses.service';
import { TaskRaw } from './types';

@Component({
  selector: 'app-tasks-show',
  template: `
<app-show-page [id]="data?.id ?? null" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses" type="tasks" (cancel)="cancelTasks()" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('tasks')"></mat-icon>
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
    TasksIndexService,
    TableService,
    TableStorageService,
    TableURLService,
    TasksFiltersService,
    NotificationService,
    MatSnackBar,
    FiltersService,
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent implements TaskShowComponent, OnInit, AfterViewInit {
  data: TaskRaw | null = null;
  sharableURL = '';
  refresh: Subject<void> = new Subject<void>();
  id: string; 
  actionData = { 
    sessionId: '',
    partitionId: '',
    resultsQueryParams: {},
    taskStatus: TaskStatus.TASK_STATUS_UNSPECIFIED,
  };

  _tasksStatusesService = inject(TasksStatusesService);
  _filtersService = inject(FiltersService);

  _iconsService = inject(IconsService);
  _grpcService = inject(TasksGrpcService);
  _shareURLService = inject(ShareUrlService);
  _notificationService = inject(NotificationService);
  _route = inject(ActivatedRoute);

  actionButtons: ShowActionButton[] = [
    {
      name: $localize`See session`,
      icon: this.getPageIcon('sessions'),
      area: 'left',
      link: `/sessions/${this.actionData.sessionId}`,
    },
    {
      name: $localize`See results`,
      icon: this.getPageIcon('results'),
      area: 'left',
      link: '/results',
      queryParams: this.actionData.resultsQueryParams
    },
    {
      name: $localize`See partition`,
      icon: this.getPageIcon('partitions'),
      area: 'left',
      link: `/partitions/${this.actionData.partitionId}`,
    },
    {
      name: $localize`Cancel task`,
      icon: this.getIcon('cancel'),
      area: 'right',
      action: this.cancelTasks,
      disabled: this.canCancel()
    }
  ];


  ngOnInit(): void {
    this.sharableURL = this._shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {

    this.refresh.pipe(
      switchMap(() => {
        return this._grpcService.get$(this.id);
      }),
      map((data) => {
        return data.task ?? null;
      })
    ).subscribe((data) => {
      if (data) {
        this.data = data;
        this.actionData.sessionId = data.sessionId;
        this.setResultsQueryParams(data.id);
        this.actionData.partitionId = data.options?.partitionId ?? '';
        this.actionData.taskStatus = data?.status ?? TaskStatus.TASK_STATUS_UNSPECIFIED;
      }
    });

    this._route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });
  }

  getPageIcon(name: Page): string {
    return this._iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  ownerSessionId() {
    return (this.data as TaskRaw).sessionId;
  }

  canCancel() {
    return this._tasksStatusesService.taskNotEnded(this.actionData.taskStatus);
  }

  setResultsQueryParams(taskId: string) {
    const keyResult = this._filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);

    this.actionData.resultsQueryParams = {
      [keyResult]: taskId
    };
  }

  get statuses() {
    return this._tasksStatusesService.statuses;
  }

  cancelTasks(): void {
    if(!this.data || !this.data.id) {
      return;
    }

    this._grpcService.cancel$([this.data.id]).subscribe({
      complete: () => {
        this._notificationService.success('Task canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this._notificationService.error('Unable to cancel task');
      },
    });
  }

  onRefresh() {
    this.refresh.next();
  }
}
